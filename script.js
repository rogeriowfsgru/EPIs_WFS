// EPI Control WFS - Sistema Completo com Login e Tema

// ============ SISTEMA DE AUTENTICAÇÃO ============
let usuarioAtual = null;

function carregarUsuarios() {
    let usuarios = localStorage.getItem("usuarios_wfs");
    if (!usuarios) {
        const admin = {
            id: 1,
            nome: "Administrador",
            usuario: "admin",
            email: "admin@wfs.com",
            senha: "admin123",
            nivel: "admin",
            dataCriacao: new Date().toISOString()
        };
        localStorage.setItem("usuarios_wfs", JSON.stringify([admin]));
        return [admin];
    }
    return JSON.parse(usuarios);
}

function salvarUsuarios(usuarios) {
    localStorage.setItem("usuarios_wfs", JSON.stringify(usuarios));
}

function fazerLogin() {
    const usuario = document.getElementById("loginUsuario").value.trim();
    const senha = document.getElementById("loginSenha").value;
    const alertDiv = document.getElementById("loginAlert");
    
    if (!usuario || !senha) {
        alertDiv.style.display = "block";
        alertDiv.className = "alert alert-error";
        alertDiv.innerHTML = "Preencha usuário e senha!";
        return;
    }
    
    const usuarios = carregarUsuarios();
    const user = usuarios.find(u => u.usuario === usuario && u.senha === senha);
    
    if (user) {
        usuarioAtual = user;
        localStorage.setItem("usuario_atual_wfs", JSON.stringify(user));
        document.getElementById("loginContainer").style.display = "none";
        document.getElementById("mainSystem").style.display = "block";
        document.getElementById("userNameDisplay").textContent = user.nome;
        document.getElementById("userLevelDisplay").textContent = user.nivel === "admin" ? "Administrador" : "Operador";
        
        if (user.nivel === "admin") {
            document.querySelectorAll(".admin-only").forEach(el => el.style.display = "flex");
        }
        mostrarFeedback("Bem-vindo, " + user.nome + "!", "success");
        carregarDados();
        renderizarUsuarios();
    } else {
        alertDiv.style.display = "block";
        alertDiv.className = "alert alert-error";
        alertDiv.innerHTML = "Usuário ou senha incorretos!<br>Tente admin / admin123";
    }
}

function cadastrarUsuario() {
    const nome = document.getElementById("cadNome").value.trim();
    const usuario = document.getElementById("cadUsuario").value.trim();
    const email = document.getElementById("cadEmail").value.trim();
    const senha = document.getElementById("cadSenha").value;
    const confirmar = document.getElementById("cadConfirmar").value;
    const nivel = document.getElementById("cadNivel").value;
    const alertDiv = document.getElementById("cadastroAlert");
    
    if (!nome || !usuario || !email || !senha) {
        alertDiv.style.display = "block";
        alertDiv.className = "alert alert-error";
        alertDiv.innerHTML = "Preencha todos os campos!";
        return;
    }
    
    if (senha !== confirmar) {
        alertDiv.style.display = "block";
        alertDiv.className = "alert alert-error";
        alertDiv.innerHTML = "As senhas não coincidem!";
        return;
    }
    
    if (senha.length < 4) {
        alertDiv.style.display = "block";
        alertDiv.className = "alert alert-error";
        alertDiv.innerHTML = "A senha deve ter pelo menos 4 caracteres!";
        return;
    }
    
    const usuarios = carregarUsuarios();
    
    if (usuarios.find(u => u.usuario === usuario)) {
        alertDiv.style.display = "block";
        alertDiv.className = "alert alert-error";
        alertDiv.innerHTML = "Usuário já existe!";
        return;
    }
    
    const novoUsuario = {
        id: Date.now(),
        nome, usuario, email, senha, nivel,
        dataCriacao: new Date().toISOString()
    };
    
    usuarios.push(novoUsuario);
    salvarUsuarios(usuarios);
    
    alertDiv.style.display = "block";
    alertDiv.className = "alert alert-success";
    alertDiv.innerHTML = "Usuário cadastrado com sucesso!";
    
    setTimeout(() => voltarLogin(), 2000);
}

function recuperarSenha() {
    const email = document.getElementById("recEmail").value.trim();
    const alertDiv = document.getElementById("recuperarAlert");
    const usuarios = carregarUsuarios();
    const user = usuarios.find(u => u.email === email);
    
    if (!user) {
        alertDiv.style.display = "block";
        alertDiv.className = "alert alert-error";
        alertDiv.innerHTML = "E-mail não encontrado!";
        return;
    }
    
    alertDiv.style.display = "block";
    alertDiv.className = "alert alert-success";
    alertDiv.innerHTML = `Sua senha é: ${user.senha}`;
}

function mostrarCadastro() {
    document.getElementById("loginContainer").style.display = "none";
    document.getElementById("cadastroContainer").style.display = "flex";
    document.getElementById("recuperarContainer").style.display = "none";
}

function mostrarRecuperar() {
    document.getElementById("loginContainer").style.display = "none";
    document.getElementById("cadastroContainer").style.display = "none";
    document.getElementById("recuperarContainer").style.display = "flex";
}

function voltarLogin() {
    document.getElementById("loginContainer").style.display = "flex";
    document.getElementById("cadastroContainer").style.display = "none";
    document.getElementById("recuperarContainer").style.display = "none";
    document.getElementById("loginUsuario").value = "";
    document.getElementById("loginSenha").value = "";
    document.getElementById("loginAlert").style.display = "none";
}

function fazerLogout() {
    localStorage.removeItem("usuario_atual_wfs");
    document.getElementById("mainSystem").style.display = "none";
    document.getElementById("loginContainer").style.display = "flex";
    mostrarFeedback("Logout realizado!", "success");
}

function renderizarUsuarios() {
    const container = document.getElementById("listaUsuarios");
    if (!container) return;
    
    const usuarios = carregarUsuarios();
    if (usuarios.length === 0) {
        container.innerHTML = "<div class='empty-state'>Nenhum usuário cadastrado</div>";
        return;
    }
    
    container.innerHTML = usuarios.map(u => `
        <div class="colaborador-item" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; padding:12px; border-bottom:1px solid var(--border-color)">
            <div style="flex:1">
                <strong>${u.usuario}</strong> - ${u.nome}<br>
                <small>${u.email} | Nível: ${u.nivel === "admin" ? "Administrador" : "Operador"} | Criado: ${new Date(u.dataCriacao).toLocaleDateString()}</small>
            </div>
            <div style="margin-top:8px">
                ${u.id !== 1 && usuarioAtual?.nivel === "admin" && u.id !== usuarioAtual?.id ? `
                <button class="edit-btn" onclick="promoverAdmin(${u.id})"><i class="fas fa-crown"></i> Promover</button>
                <button class="delete-btn" onclick="deletarUsuario(${u.id})"><i class="fas fa-trash"></i> Excluir</button>
                ` : u.id === 1 ? '<span style="color:var(--text-secondary); font-size:12px">Usuário padrão</span>' : ''}
            </div>
        </div>
    `).join("");
}

function promoverAdmin(id) {
    const usuarios = carregarUsuarios();
    const user = usuarios.find(u => u.id === id);
    if (user && user.nivel !== "admin") {
        user.nivel = "admin";
        salvarUsuarios(usuarios);
        renderizarUsuarios();
        mostrarFeedback(`Usuário ${user.usuario} promovido a Administrador!`, "success");
    }
}

function deletarUsuario(id) {
    if (confirm("Tem certeza que deseja excluir este usuário?")) {
        let usuarios = carregarUsuarios();
        usuarios = usuarios.filter(u => u.id !== id);
        salvarUsuarios(usuarios);
        renderizarUsuarios();
        mostrarFeedback("Usuário excluído com sucesso!", "success");
    }
}

function verificarSessao() {
    const savedUser = localStorage.getItem("usuario_atual_wfs");
    if (savedUser) {
        usuarioAtual = JSON.parse(savedUser);
        document.getElementById("loginContainer").style.display = "none";
        document.getElementById("mainSystem").style.display = "block";
        document.getElementById("userNameDisplay").textContent = usuarioAtual.nome;
        document.getElementById("userLevelDisplay").textContent = usuarioAtual.nivel === "admin" ? "Administrador" : "Operador";
        
        if (usuarioAtual.nivel === "admin") {
            document.querySelectorAll(".admin-only").forEach(el => el.style.display = "flex");
        }
        carregarDados();
        renderizarUsuarios();
    }
}

// ============ SISTEMA DE TEMA (ESCURO/CLARO) ============
function initTheme() {
    const savedTheme = localStorage.getItem('theme_wfs');
    const themeToggle = document.getElementById('themeToggle');
    
    if (savedTheme === 'dark') {
        document.body.classList.add('dark');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
    
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark');
        const isDark = document.body.classList.contains('dark');
        localStorage.setItem('theme_wfs', isDark ? 'dark' : 'light');
        themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        
        themeToggle.style.transform = 'scale(1.1)';
        setTimeout(() => {
            themeToggle.style.transform = 'scale(1)';
        }, 200);
        
        mostrarFeedback(isDark ? 'Modo escuro ativado' : 'Modo claro ativado', 'info');
    });
}

// ============ SISTEMA DE PARTÍCULAS ============
function createParticles() {
    const container = document.getElementById('particlesContainer');
    if (!container) return;
    
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        const size = Math.random() * 6 + 2;
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 20;
        const left = Math.random() * 100;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${left}%`;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `${delay}s`;
        particle.style.opacity = Math.random() * 0.5 + 0.1;
        
        container.appendChild(particle);
    }
}

// ============ DADOS DO SISTEMA ============
const listaEPIsBase = [
    { codigo: "38.302", descricao: "AVENTAL IMPERMEAVEL" }, { codigo: "43.553", descricao: "Boné Casquete" },
    { codigo: "37.456", descricao: "Bota PVC" }, { codigo: "47.910", descricao: "Botina Composite" },
    { codigo: "41.121", descricao: "Botina Nobuk" }, { codigo: "41.688", descricao: "Capa de Chuva" },
    { codigo: "00", descricao: "Colete Vermelho" }, { codigo: "01", descricao: "Colete Verde" },
    { codigo: "20.722", descricao: "Luva de Vinil" }, { codigo: "40.029", descricao: "Luva Mista" },
    { codigo: "16.314", descricao: "Luva Nitrílica P33" }, { codigo: "14.334", descricao: "Luva Nitrílica P46" },
    { codigo: "30.916", descricao: "Luva Tátil" }, { codigo: "38.293", descricao: "Luva Volk" },
    { codigo: "19.176", descricao: "Óculos Fume" }, { codigo: "42.721", descricao: "Óculos Incolor" },
    { codigo: "40.186", descricao: "Óculos Visão Ampla" }, { codigo: "36.817", descricao: "Protetor Auricular" },
    { codigo: "39.235", descricao: "Respirador PFF2" }, { codigo: "36.802", descricao: "Viseira Facial Incolor" },
    { codigo: "34.570", descricao: "Luva de PVC P70" }, { codigo: "37.464", descricao: "Botina de PVC" },
    { codigo: "39.183", descricao: "Macacão de Segurança" }, { codigo: "14.235", descricao: "Protetor Auricular Tipo Concha" },
    { codigo: "9.611", descricao: "Creme Proteção" }, { codigo: "03", descricao: "Protetor Solar" },
    { codigo: "47.398", descricao: "Sapato de Segurança" }, { codigo: "49731", descricao: "Capuz Árabe" }
];
listaEPIsBase.sort((a,b)=>a.descricao.localeCompare(b.descricao));

let colaboradores = [], estoque = {}, movimentacoes = [], carrinho = [], editando = null;

function inicializarEstoque() {
    listaEPIsBase.forEach(e => { 
        if(!estoque[e.codigo]) {
            estoque[e.codigo] = { 
                codigo: e.codigo, 
                descricao: e.descricao, 
                quantidade: 10,
                emUso: 0, 
                ultimaMov: null 
            };
        }
    });
}

function carregarDados() {
    const se = localStorage.getItem("estoque_final12"); 
    if(se) {
        estoque = JSON.parse(se);
    } else {
        inicializarEstoque();
        salvarDados();
    }
    const sm = localStorage.getItem("movs_final12"); if(sm) movimentacoes = JSON.parse(sm);
    const sc = localStorage.getItem("colabs_final12"); if(sc) colaboradores = JSON.parse(sc);
    salvarDados();
}

function salvarDados() {
    localStorage.setItem("estoque_final12", JSON.stringify(estoque));
    localStorage.setItem("movs_final12", JSON.stringify(movimentacoes));
    localStorage.setItem("colabs_final12", JSON.stringify(colaboradores));
    atualizarStats();
    renderizarColaboradores();
    renderizarEstoque();
    renderizarHistorico();
    preencherSelect();
}

function atualizarStats() {
    const totalEPIs = Object.keys(estoque).length;
    const totalMovs = movimentacoes.length;
    const ativos = new Set(movimentacoes.filter(m=>m.tipo==="saida"&&!m.devolvido).map(m=>m.matricula));
    
    animateNumber(document.getElementById("totalEPIs"), totalEPIs);
    animateNumber(document.getElementById("totalMovs"), totalMovs);
    animateNumber(document.getElementById("totalAtivos"), ativos.size);
}

function animateNumber(element, target) {
    if (!element) return;
    const start = parseInt(element.textContent) || 0;
    const duration = 500;
    const step = (target - start) / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += step;
        if ((step > 0 && current >= target) || (step < 0 && current <= target)) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.round(current);
        }
    }, 16);
}

function mostrarFeedback(msg, tipo) {
    const div = document.getElementById("feedbackMsg");
    if(!div) return;
    div.style.display = "flex";
    div.className = `feedback-toast ${tipo}`;
    div.innerHTML = `<i class="fas ${tipo==='success'?'fa-check-circle':tipo==='error'?'fa-exclamation-circle':'fa-info-circle'}"></i><span>${msg}</span>`;
    setTimeout(()=>{
        div.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(()=>{
            div.style.display = "none";
            div.style.animation = '';
        }, 300);
    }, 3000);
}

function obterDataHora() { const n=new Date(); return `${n.getDate().toString().padStart(2,'0')}/${(n.getMonth()+1).toString().padStart(2,'0')}/${n.getFullYear()} ${n.getHours().toString().padStart(2,'0')}:${n.getMinutes().toString().padStart(2,'0')}:${n.getSeconds().toString().padStart(2,'0')}`; }
function obterData() { const n=new Date(); return `${n.getDate().toString().padStart(2,'0')}/${(n.getMonth()+1).toString().padStart(2,'0')}/${n.getFullYear()}`; }

// Navegação
document.querySelectorAll('.tab-btn').forEach(btn=>{
    btn.addEventListener('click',()=>{
        document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(t=>t.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(`tab-${btn.dataset.tab}`).classList.add('active');
        if(btn.dataset.tab==='movimentacoes') renderizarHistorico();
        if(btn.dataset.tab==='estoque') renderizarEstoque();
        if(btn.dataset.tab==='usuarios') renderizarUsuarios();
    });
});

// AUTOCOMPLETE CORRIGIDO
document.getElementById("matricula")?.addEventListener("input", function() {
    const val = this.value.toLowerCase();
    const lista = document.getElementById("autocompleteList");
    
    if(!val || val.length === 0) { 
        lista.style.display = "none"; 
        document.getElementById("infoColaborador").style.display = "none"; 
        return; 
    }
    
    const filtrados = colaboradores.filter(c => 
        c.matricula.toLowerCase().includes(val) || 
        c.nome.toLowerCase().includes(val)
    );
    
    if(filtrados.length > 0){
        lista.innerHTML = filtrados.map(c => `
            <div class="autocomplete-item" onclick="selecionarColab('${c.matricula}','${c.nome.replace(/'/g, "\\'")}','${c.funcao || ''}','${c.secao || ''}')">
                <strong>${c.matricula}</strong> - ${c.nome}
            </div>
        `).join("");
        lista.style.display = "block";
        lista.style.width = this.offsetWidth + "px";
    } else { 
        lista.style.display = "none"; 
    }
});

function selecionarColab(mat, nome, funcao, secao) {
    document.getElementById("matricula").value = mat;
    document.getElementById("autocompleteList").style.display = "none";
    document.getElementById("infoNome").textContent = nome;
    document.getElementById("infoFuncao").textContent = funcao||"---";
    document.getElementById("infoSecao").textContent = secao||"---";
    document.getElementById("infoColaborador").style.display = "block";
    
    const epis = movimentacoes.filter(m=>m.matricula===mat&&m.tipo==="saida"&&!m.devolvido);
    const listaDiv = document.getElementById("listaEPIsColaborador");
    const fichaDiv = document.getElementById("fichaEPIs");
    
    if(epis.length){
        listaDiv.innerHTML = epis.map(e=>`<div class="epi-item-ficha"><div><span class="epi-nome">${e.descricaoEPI}</span><div class="epi-data">Retirado em: ${e.dataHora} | Qtd: ${e.quantidade}</div></div><span class="badge badge-warning">Em uso</span></div>`).join("");
        fichaDiv.style.display = "block";
    } else {
        listaDiv.innerHTML = "<div style='padding:15px;text-align:center'>Nenhum EPI retirado</div>";
        fichaDiv.style.display = "block";
    }
}

function preencherSelect() {
    const s = document.getElementById("epiSelect");
    if(!s) return;
    s.innerHTML = '<option value="" disabled selected>Selecione um EPI</option>';
    Object.values(estoque).sort((a,b)=>a.descricao.localeCompare(b.descricao)).forEach(e=>{ const o=document.createElement("option"); o.value=e.codigo; o.textContent=`${e.descricao} (${e.codigo}) - Estoque:${e.quantidade}`; s.appendChild(o); });
}

function adicionarRequerimento() {
    const cod = document.getElementById("epiSelect").value;
    const qtd = parseInt(document.getElementById("quantidade").value);
    if(!cod){ mostrarFeedback("Selecione um EPI!","error"); return; }
    if(isNaN(qtd)||qtd<1){ mostrarFeedback("Quantidade inválida!","error"); return; }
    const est = estoque[cod];
    if(!est){ mostrarFeedback("EPI não encontrado!","error"); return; }
    if(est.quantidade<qtd){ mostrarFeedback(`Estoque insuficiente! Disponível: ${est.quantidade}`,"error"); return; }
    const exist = carrinho.find(r=>r.codigo===cod);
    if(exist) exist.quantidade += qtd;
    else carrinho.push({ codigo:cod, quantidade:qtd, descricao:est.descricao });
    atualizarCarrinho();
    document.getElementById("quantidade").value="1";
    mostrarFeedback(`✅ ${est.descricao} adicionado!`,"success");
}

function atualizarCarrinho() {
    const div = document.getElementById("carrinhoLista");
    const span = document.getElementById("totalCarrinho");
    if(!div) return;
    if(carrinho.length===0){ div.innerHTML='<div style="text-align:center;color:var(--text-secondary);padding:20px;"><i class="fas fa-inbox"></i> Nenhum EPI adicionado</div>'; if(span) span.textContent="0 itens"; return; }
    const total = carrinho.reduce((s,i)=>s+i.quantidade,0);
    if(span) span.textContent = `${total} item(s)`;
    div.innerHTML = carrinho.map((item,idx)=>`
        <div class="carrinho-item">
            <div class="carrinho-item-info">
                <span class="carrinho-item-nome"><i class="fas fa-hard-hat"></i> ${item.descricao}</span>
                <span class="carrinho-item-qtd"><i class="fas fa-boxes"></i> Quantidade: ${item.quantidade}</span>
            </div>
            <button class="btn-remover-carrinho" onclick="removerItem(${idx})"><i class="fas fa-trash"></i> Remover</button>
        </div>
    `).join("");
}

function removerItem(idx){ carrinho.splice(idx,1); atualizarCarrinho(); mostrarFeedback("Item removido","success"); }
function cancelarRequerimento(){ if(carrinho.length && confirm("Cancelar este requerimento?")){ carrinho=[]; atualizarCarrinho(); document.getElementById("matricula").value=""; document.getElementById("infoColaborador").style.display="none"; document.getElementById("fichaEPIs").style.display="none"; mostrarFeedback("Requerimento cancelado!","success"); } }

function finalizarRequerimento() {
    const mat = document.getElementById("matricula").value;
    if(!mat){ mostrarFeedback("Digite a matrícula!","error"); return; }
    if(carrinho.length===0){ mostrarFeedback("Adicione EPIs!","error"); return; }
    const colab = colaboradores.find(c=>c.matricula===mat);
    if(!colab){ mostrarFeedback("Colaborador não cadastrado!","error"); return; }
    const dh = obterDataHora(), d = obterData();
    let erros=[], ok=0;
    for(const item of carrinho){
        const est = estoque[item.codigo];
        if(!est || est.quantidade<item.quantidade){ erros.push(`Estoque insuficiente para ${item.descricao}`); continue; }
        est.quantidade -= item.quantidade;
        est.emUso += item.quantidade;
        est.ultimaMov = dh;
        movimentacoes.unshift({ id:Date.now(), tipo:"saida", matricula:mat, nomeColab:colab.nome, codigoEPI:item.codigo, descricaoEPI:item.descricao, quantidade:item.quantidade, dataHora:dh, data:d, devolvido:false });
        ok++;
    }
    if(erros.length) mostrarFeedback(`⚠️ ${erros.join("; ")}`,"error");
    if(ok){ mostrarFeedback(`✅ Requerimento finalizado! ${ok} item(s)`,"success"); carrinho=[]; atualizarCarrinho(); salvarDados(); renderizarEstoque(); preencherSelect(); renderizarHistorico(); document.getElementById("matricula").value=""; document.getElementById("infoColaborador").style.display="none"; document.getElementById("fichaEPIs").style.display="none"; }
}

function renderizarEstoque() {
    const tbody = document.getElementById("estoqueBody");
    if(!tbody) return;
    const ordenados = Object.values(estoque).sort((a,b)=>a.descricao.localeCompare(b.descricao));
    tbody.innerHTML = "";
    for(const e of ordenados){
        const row = tbody.insertRow();
        
        if(e.quantidade === 0) {
            row.style.backgroundColor = "#fee2e2";
        } else if(e.quantidade <= 5) {
            row.style.backgroundColor = "#fef3c7";
        }
        
        row.insertCell(0).innerHTML = `<strong>${e.codigo}</strong>`;
        row.insertCell(1).innerHTML = e.descricao;
        
        let badgeClass = 'badge-success';
        let badgeText = `${e.quantidade} unidades`;
        if(e.quantidade === 0) {
            badgeClass = 'badge-danger';
        } else if(e.quantidade <= 5) {
            badgeClass = 'badge-warning';
        }
        row.insertCell(2).innerHTML = `<span class="badge ${badgeClass}">${badgeText}</span>`;
        
        let statusClass = 'badge-success';
        let statusText = 'Disponível';
        if(e.quantidade === 0) {
            statusClass = 'badge-danger';
            statusText = 'Esgotado';
        } else if(e.quantidade <= 5) {
            statusClass = 'badge-warning';
            statusText = 'Atenção - Estoque Baixo';
        }
        row.insertCell(3).innerHTML = `<span class="badge ${statusClass}">${statusText}</span>`;
        
        row.insertCell(4).innerHTML = e.emUso>0?`${e.emUso} em uso`:'---';
        row.insertCell(5).innerHTML = e.ultimaMov || '---';
        row.insertCell(6).innerHTML = `<button class="edit-btn" onclick="editarEPI('${e.codigo}')"><i class="fas fa-edit"></i> Editar</button>`;
    }
}

function salvarEPI() {
    const cod = document.getElementById("epiCodigo").value.trim();
    const desc = document.getElementById("epiDescricao").value.trim();
    const qtd = parseInt(document.getElementById("epiQtd").value);
    if(!cod||!desc){ mostrarFeedback("Preencha código e descrição!","error"); return; }
    if(isNaN(qtd)||qtd<0){ mostrarFeedback("Quantidade inválida!","error"); return; }
    if(editando){
        if(editando!==cod && estoque[cod]){ mostrarFeedback("Código já existe!","error"); return; }
        const antigo = estoque[editando];
        delete estoque[editando];
        estoque[cod] = { codigo:cod, descricao:desc, quantidade:qtd, emUso:antigo?.emUso||0, ultimaMov:antigo?.ultimaMov||obterDataHora() };
        mostrarFeedback(`✅ EPI editado!`,"success");
        editando=null;
    } else {
        if(estoque[cod]){ estoque[cod].quantidade += qtd; if(desc) estoque[cod].descricao=desc; mostrarFeedback(`✅ Estoque atualizado!`,"success"); }
        else { estoque[cod] = { codigo:cod, descricao:desc, quantidade:qtd, emUso:0, ultimaMov:obterDataHora() }; mostrarFeedback(`✅ EPI cadastrado!`,"success"); }
    }
    salvarDados(); renderizarEstoque(); preencherSelect(); limparEPI();
}

function editarEPI(cod){ const e=estoque[cod]; if(e){ document.getElementById("epiCodigo").value=e.codigo; document.getElementById("epiDescricao").value=e.descricao; document.getElementById("epiQtd").value=e.quantidade; editando=cod; mostrarFeedback(`✏️ Editando: ${e.descricao}`,"info"); } }
function limparEPI(){ document.getElementById("epiCodigo").value=""; document.getElementById("epiDescricao").value=""; document.getElementById("epiQtd").value=""; editando=null; }

function renderizarHistorico(filtro=""){
    const cont = document.getElementById("listaHistorico");
    if(!cont) return;
    let dados = [...movimentacoes];
    if(filtro) dados = dados.filter(m=>m.matricula.toLowerCase().includes(filtro.toLowerCase())||m.nomeColab.toLowerCase().includes(filtro.toLowerCase()));
    if(dados.length===0){ cont.innerHTML='<div class="empty-state"><i class="fas fa-inbox"></i><p>Nenhum movimento encontrado</p></div>'; return; }
    cont.innerHTML = dados.map(m=>`
        <div class="historico-item">
            <div style="display:flex;justify-content:space-between; align-items:center; margin-bottom:8px">
                <strong style="color:var(--primary);"><i class="fas fa-arrow-right"></i> RETIRADA</strong>
                <span style="font-size:11px;color:var(--text-secondary);"><i class="far fa-clock"></i> ${m.dataHora}</span>
            </div>
            <div style="margin-bottom:4px"><i class="fas fa-hard-hat"></i> <strong>EPI:</strong> ${m.descricaoEPI} - Quantidade: ${m.quantidade}</div>
            <div style="margin-bottom:4px"><i class="fas fa-id-card"></i> <strong>Matrícula:</strong> ${m.matricula}</div>
            <div><i class="fas fa-user"></i> <strong>Colaborador:</strong> ${m.nomeColab}</div>
        </div>
    `).join("");
}

function renderizarColaboradores(busca=""){
    const tbody = document.getElementById("colaboradoresTableBody");
    if(!tbody) return;
    if(!busca){ tbody.innerHTML='<td><td colspan="7"><div class="empty-state"><i class="fas fa-search"></i><p>Digite matrícula ou nome para buscar</p></div>}</td></tr>'; return; }
    const filtrados = colaboradores.filter(c=>c.matricula.toLowerCase().includes(busca.toLowerCase())||c.nome.toLowerCase().includes(busca.toLowerCase()));
    if(filtrados.length===0){ tbody.innerHTML='<tr><td colspan="7"><div class="empty-state"><i class="fas fa-user-slash"></i><p>Nenhum colaborador encontrado</p></div></td></tr>'; return; }
    tbody.innerHTML = "";
    filtrados.forEach(c => {
        const epis = movimentacoes.filter(m=>m.matricula===c.matricula&&m.tipo==="saida"&&!m.devolvido);
        const row = tbody.insertRow();
        row.insertCell(0).innerHTML = `<strong>${c.matricula}</strong>`;
        row.insertCell(1).innerHTML = `<i class="fas fa-user"></i> ${c.nome}`;
        row.insertCell(2).innerHTML = c.secao || '---';
        row.insertCell(3).innerHTML = c.dataAdmissao || '---';
        row.insertCell(4).innerHTML = c.funcao || '---';
        row.insertCell(5).innerHTML = `<span class="badge badge-success">${epis.length} EPI(s)</span>`;
        row.insertCell(6).innerHTML = `<button class="edit-btn" onclick="editarColab('${c.matricula}')"><i class="fas fa-edit"></i></button><button class="delete-btn" onclick="deletarColab('${c.matricula}')"><i class="fas fa-trash"></i></button>`;
    });
}

function cadastrarColaborador(){
    const mat=document.getElementById("cadMatricula").value.trim(), nom=document.getElementById("cadNome").value.trim(), sec=document.getElementById("cadSecao").value.trim(), dat=document.getElementById("cadDataAdmissao").value, func=document.getElementById("cadFuncao").value.trim();
    if(!mat||!nom){ mostrarFeedback("Matrícula e Nome obrigatórios!","error"); return; }
    if(colaboradores.find(c=>c.matricula===mat)){ mostrarFeedback("Matrícula já existe!","error"); return; }
    colaboradores.push({matricula:mat, nome:nom, secao:sec, dataAdmissao:dat, funcao:func});
    salvarDados();
    document.getElementById("cadMatricula").value=""; document.getElementById("cadNome").value=""; document.getElementById("cadSecao").value=""; document.getElementById("cadDataAdmissao").value=""; document.getElementById("cadFuncao").value="";
    mostrarFeedback(`✅ ${nom} cadastrado!`,"success");
}

function editarColab(mat){ const c=colaboradores.find(c=>c.matricula===mat); if(c){ document.getElementById("cadMatricula").value=c.matricula; document.getElementById("cadNome").value=c.nome; document.getElementById("cadSecao").value=c.secao||""; document.getElementById("cadDataAdmissao").value=c.dataAdmissao||""; document.getElementById("cadFuncao").value=c.funcao||""; deletarColab(mat,true); mostrarFeedback("Edite e clique em Cadastrar","info"); } }
function deletarColab(mat,sil=false){ const c=colaboradores.find(c=>c.matricula===mat); if(!c) return; const pend=movimentacoes.filter(m=>m.matricula===mat&&m.tipo==="saida"&&!m.devolvido); if(pend.length&&!sil){ mostrarFeedback(`Colaborador tem ${pend.length} EPI(s) pendente(s)!`,"error"); return; } colaboradores=colaboradores.filter(c=>c.matricula!==mat); salvarDados(); if(!sil) mostrarFeedback(`🗑️ ${c.nome} removido`,"success"); renderizarColaboradores(document.getElementById("buscaColab").value); }

// Upload CSV
document.getElementById("uploadArea")?.addEventListener("click",()=>document.getElementById("fileInput").click());
document.getElementById("fileInput")?.addEventListener("change",e=>{
    const file=e.target.files[0]; if(!file) return;
    const reader=new FileReader();
    reader.onload=ev=>{
        let content=ev.target.result;
        if(content.charCodeAt(0)===0xFEFF) content=content.substring(1);
        const linhas=content.split(/\r?\n/);
        let imp=0;
        for(let i=0;i<linhas.length;i++){
            let linha=linhas[i].trim();
            if(!linha) continue;
            if(i===0 && linha.toLowerCase().includes('matricula')) continue;
            const sep=linha.includes(';')?';':',';
            let partes=linha.split(sep).map(p=>p.trim().replace(/^["']|["']$/g,''));
            if(partes[0]){
                const mat=partes[0], nom=partes[1]||`Colab ${mat}`, sec=partes[2]||"", dat=partes[3]||"", func=partes[4]||"";
                if(!colaboradores.find(c=>c.matricula===mat)){ colaboradores.push({matricula:mat, nome:nom, secao:sec, dataAdmissao:dat, funcao:func}); imp++; }
            }
        }
        if(imp){ salvarDados(); document.getElementById("uploadInfo").innerHTML=`<i class="fas fa-check-circle"></i> ✅ ${imp} importados! Total:${colaboradores.length}`; mostrarFeedback(`✅ ${imp} colaboradores importados!`,"success"); renderizarColaboradores(""); document.getElementById("fileInput").value=""; }
        else mostrarFeedback("Nenhum colaborador importado!","error");
    };
    reader.readAsText(file,"UTF-8");
});

// RELATÓRIOS PDF
function gerarPDF(html,nome){ const w=window.open(); if(w){ w.document.write(html); w.document.close(); setTimeout(()=>w.print(),1000); } else mostrarFeedback("Permita pop-ups!","error"); }

function relatorioDiario() {
    const data = document.getElementById("dataDiaria").value;
    if(!data){ mostrarFeedback("Selecione uma data!","error"); return; }
    const [ano, mes, dia] = data.split('-');
    const dataFmt = `${dia}/${mes}/${ano}`;
    const movs = movimentacoes.filter(m => m.data === dataFmt);
    let tabela = '';
    for(const m of movs){ tabela += `<tr><td style="padding:6px">${m.dataHora}</td><td style="padding:6px">${m.matricula}</td><td style="padding:6px">${m.nomeColab}</td><td style="padding:6px">${m.descricaoEPI}</td><td style="padding:6px">${m.quantidade}</td></tr>`; }
    if(movs.length === 0) tabela = '<tr><td colspan="5" style="text-align:center;padding:6px">Nenhuma movimentação encontrada</td></tr>';
    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Relatório Diário - ${dataFmt}</title><style>body{font-family:Arial;margin:15px;font-size:11px}h1{font-size:16px;color:#2563EB}h2{font-size:14px}table{width:100%;border-collapse:collapse;margin-top:10px}th{background:#2563EB;color:#fff;padding:6px;text-align:left;font-size:10px}td{border:1px solid #ccc;padding:6px;font-size:9px}.footer{margin-top:15px;font-size:8px;text-align:center;border-top:1px solid #ccc;padding-top:8px}</style></head><body><h1>EPI Control WFS</h1><h2>Relatório Diário - ${dataFmt}</h2><p>Gerado em: ${new Date().toLocaleString()}</p><p><strong>Total de movimentações:</strong> ${movs.length}</p><table border="1"><thead><tr><th>Data/Hora</th><th>Matrícula</th><th>Colaborador</th><th>EPI</th><th>Quantidade</th></tr></thead><tbody>${tabela}</tbody></table><div class="footer">Documento gerado eletronicamente pelo sistema EPI Control WFS em ${new Date().toLocaleString()}</div></body></html>`;
    gerarPDF(html, `relatorio_diario_${data}.pdf`);
}

function relatorioMensal() {
    const ma = document.getElementById("dataMensal").value;
    if(!ma){ mostrarFeedback("Selecione um mês!","error"); return; }
    const [ano, mes] = ma.split('-');
    const movs = movimentacoes.filter(m => { const [d, m2, a] = m.data.split('/'); return m2 === mes && a === ano; });
    let tabela = '';
    for(const m of movs){ tabela += `<td><td style="padding:6px">${m.dataHora}</td><td style="padding:6px">${m.matricula}</td><td style="padding:6px">${m.nomeColab}</td><td style="padding:6px">${m.descricaoEPI}</td><td style="padding:6px">${m.quantidade}</td></tr>`; }
    if(movs.length === 0) tabela = '<tr><td colspan="5" style="text-align:center;padding:6px">Nenhuma movimentação encontrada</td></tr>';
    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Relatório Mensal - ${mes}/${ano}</title><style>body{font-family:Arial;margin:15px;font-size:11px}h1{font-size:16px;color:#2563EB}h2{font-size:14px}table{width:100%;border-collapse:collapse;margin-top:10px}th{background:#2563EB;color:#fff;padding:6px;text-align:left;font-size:10px}td{border:1px solid #ccc;padding:6px;font-size:9px}.footer{margin-top:15px;font-size:8px;text-align:center;border-top:1px solid #ccc;padding-top:8px}</style></head><body><h1>EPI Control WFS</h1><h2>Relatório Mensal - ${mes}/${ano}</h2><p>Gerado em: ${new Date().toLocaleString()}</p><p><strong>Total de movimentações:</strong> ${movs.length}</p><table border="1"><thead><tr><th>Data/Hora</th><th>Matrícula</th><th>Colaborador</th><th>EPI</th><th>Quantidade</th></tr></thead><tbody>${tabela}</tbody></table><div class="footer">Documento gerado eletronicamente pelo sistema EPI Control WFS em ${new Date().toLocaleString()}</div></body></html>`;
    gerarPDF(html, `relatorio_mensal_${ma}.pdf`);
}

function relatorioAnual() {
    const ano = document.getElementById("dataAnual").value;
    if(!ano){ mostrarFeedback("Digite o ano!","error"); return; }
    const movs = movimentacoes.filter(m => { const [d, m2, a] = m.data.split('/'); return a === ano; });
    let tabela = '';
    for(const m of movs){ tabela += `<tr><td style="padding:6px">${m.dataHora}</td><td style="padding:6px">${m.matricula}</td><td style="padding:6px">${m.nomeColab}</td><td style="padding:6px">${m.descricaoEPI}</td><td style="padding:6px">${m.quantidade}</td></tr>`; }
    if(movs.length === 0) tabela = '<tr><td colspan="5" style="text-align:center;padding:6px">Nenhuma movimentação encontrada</td></tr>';
    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Relatório Anual - ${ano}</title><style>body{font-family:Arial;margin:15px;font-size:11px}h1{font-size:16px;color:#2563EB}h2{font-size:14px}table{width:100%;border-collapse:collapse;margin-top:10px}th{background:#2563EB;color:#fff;padding:6px;text-align:left;font-size:10px}td{border:1px solid #ccc;padding:6px;font-size:9px}.footer{margin-top:15px;font-size:8px;text-align:center;border-top:1px solid #ccc;padding-top:8px}</style></head><body><h1>EPI Control WFS</h1><h2>Relatório Anual - ${ano}</h2><p>Gerado em: ${new Date().toLocaleString()}</p><p><strong>Total de movimentações:</strong> ${movs.length}</p><table border="1"><thead><tr><th>Data/Hora</th><th>Matrícula</th><th>Colaborador</th><th>EPI</th><th>Quantidade</th></tr></thead><tbody>${tabela}</tbody>追赶<div class="footer">Documento gerado eletronicamente pelo sistema EPI Control WFS em ${new Date().toLocaleString()}</div></body></html>`;
    gerarPDF(html, `relatorio_anual_${ano}.pdf`);
}

function relatorioColaborador() {
    const busca = document.getElementById("buscaRelatorio").value;
    if(!busca){ mostrarFeedback("Digite a matrícula!","error"); return; }
    const colab = colaboradores.find(c => c.matricula === busca);
    if(!colab){ mostrarFeedback("Colaborador não encontrado!","error"); return; }
    const movs = movimentacoes.filter(m => m.matricula === busca);
    let tabela = '';
    for(const m of movs){ tabela += `<tr><td style="padding:4px">${m.dataHora}</td><td style="padding:4px">${m.descricaoEPI}</td><td style="padding:4px">${m.quantidade}</td></tr>`; }
    if(movs.length === 0) tabela = '<tr><td colspan="3" style="text-align:center;padding:4px">Nenhum EPI retirado</td></tr>';
    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Termo de Responsabilidade</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Times New Roman',Arial;margin:10px;padding:0;font-size:9px}h1{font-size:14px;color:#2563EB;text-align:center;margin-bottom:8px}h2{font-size:12px;text-align:center;margin-bottom:5px}h3{font-size:10px;text-align:center;margin:8px 0}p{margin:3px 0;font-size:8px;line-height:1.2}table{width:100%;border-collapse:collapse;margin:8px 0}th{background:#2563EB;color:#fff;padding:4px;text-align:left;font-size:8px}td{border:1px solid #999;padding:4px;font-size:8px}.info{background:#f9f9f9;padding:6px;margin:5px 0;border:1px solid #ddd;font-size:8px}.termo{border:1px solid #000;padding:6px;margin:8px 0;text-align:justify;font-size:7.5px;line-height:1.3}.assinatura{display:flex;justify-content:space-between;margin-top:15px}.linha{border-top:1px solid #000;margin-top:20px;width:80%;margin-left:auto;margin-right:auto}.footer{font-size:7px;text-align:center;margin-top:10px;border-top:1px solid #ccc;padding-top:5px}</style></head><body><h1>EPI Control WFS</h1><h2>Termo de Responsabilidade</h2><div class="info"><p><strong>Matrícula:</strong> ${colab.matricula} | <strong>Nome:</strong> ${colab.nome}</p><p><strong>Seção:</strong> ${colab.secao||'---'} | <strong>Função:</strong> ${colab.funcao||'---'}</p><p><strong>Data Admissão:</strong> ${colab.dataAdmissao||'---'} | <strong>Total EPIs:</strong> ${movs.length}</p></div><h3>EPIs Retirados</h3><table border="1"><thead><tr><th>Data/Hora da Retirada</th><th>EPI</th><th>Quantidade</th></tr></thead><tbody>${tabela}</tbody></table><div class="termo"><h3>TERMO DE RESPONSABILIDADE - EPIs</h3><p>Pelo presente, declaro ter recebido da empresa os Equipamentos de Proteção Individual (EPI's) abaixo relacionados, comprometendo-me a utilizá-los exclusivamente para a finalidade a que se destinam, responsabilizando-me pela sua guarda, conservação e integridade, comunicando imediatamente à empresa qualquer alteração que os torne impróprios para uso.</p><p>Declaro ainda que recebi treinamento adequado sobre a utilização correta, higienização, guarda e manutenção dos EPI's, bem como fui cientificado da obrigatoriedade do seu uso durante toda a execução das minhas atividades. Comprometo-me também a devolvê-los quando apresentarem desgaste natural, quando forem substituídos por novos modelos ou, ainda, no término do meu contrato de trabalho.</p><p>Este termo está em conformidade com os dispositivos da NR-01 (item 1.4.2, alínea "d", e item 1.4.2.1), bem como da NR-06 (itens 6.7 e 6.7.1, alíneas "a", "b", "c" e "d") da Portaria nº 3.214, de 08/06/78, do MTE, além do disposto nos arts. 157, 158, 166 e 167 da CLT.</p><p>Declaro estar ciente de que a conservação dos EPI's é de minha responsabilidade pessoal e única, devendo mantê-los em perfeito estado de uso. Fui informado também que, em caso de dano ocasionado por negligência, mau uso, extravio ou perda, terei a obrigação de comunicar imediatamente à empresa e providenciar a respectiva reposição, conforme previsto nas normas trabalhistas vigentes.</p><p>Por fim, reafirmo minha concordância e responsabilidade quanto ao cumprimento integral das obrigações aqui descritas.</p></div><div class="assinatura"><div style="text-align:center;width:45%"><div class="linha"></div><p><strong>${colab.nome}</strong><br>Colaborador</p></div><div style="text-align:center;width:45%"><div class="linha"></div><p><strong>Empresa</strong><br>Responsável pela entrega</p></div></div><div class="footer">Documento gerado eletronicamente pelo sistema EPI Control WFS em ${new Date().toLocaleString()}</div></body></html>`;
    gerarPDF(html, `termo_${colab.matricula}.pdf`);
}

function relatorioEstoque() {
    const epis = Object.values(estoque).sort((a,b)=>a.descricao.localeCompare(b.descricao));
    let tabela = '';
    for(const e of epis){
        const status = e.quantidade > 0 ? (e.quantidade <= 5 ? 'Alerta - Estoque Baixo' : 'Disponível') : 'Esgotado';
        tabela += `<tr><td style="padding:6px"><strong>${e.codigo}</strong></td><td style="padding:6px">${e.descricao}</td><td style="padding:6px">${e.quantidade} unidades</td> <td style="padding:6px">${e.emUso} em uso</td><td style="padding:6px">${status}</td></tr>`;
    }
    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Relatório Estoque</title><style>body{font-family:Arial;margin:15px;font-size:11px}h1{font-size:16px;color:#2563EB}p{font-size:10px}table{width:100%;border-collapse:collapse;margin-top:10px}th{background:#2563EB;color:#fff;padding:6px;text-align:left;font-size:10px}td{border:1px solid #ccc;padding:6px;font-size:9px}.footer{margin-top:15px;font-size:8px;text-align:center;border-top:1px solid #ccc;padding-top:8px}</style></head><body><h1>Relatório de Estoque</h1><p>Gerado em: ${new Date().toLocaleString()}</p><table border="1"><thead><tr><th>Código</th><th>Descrição</th><th>Quantidade</th><th>Em Uso</th><th>Status</th></tr></thead><tbody>${tabela}</tbody></table><div class="footer">Documento gerado eletronicamente pelo sistema EPI Control WFS em ${new Date().toLocaleString()}</div></body></html>`;
    gerarPDF(html, `relatorio_estoque.pdf`);
}

// Eventos
document.getElementById("btnCadastrar")?.addEventListener("click", cadastrarColaborador);
document.getElementById("btnFinalizar")?.addEventListener("click", finalizarRequerimento);
document.getElementById("btnRefresh")?.addEventListener("click", ()=>{ renderizarEstoque(); mostrarFeedback("Lista atualizada!","success"); });
document.getElementById("buscaColab")?.addEventListener("input", e=>renderizarColaboradores(e.target.value));
document.getElementById("btnLimparBusca")?.addEventListener("click", ()=>{ document.getElementById("buscaColab").value=""; renderizarColaboradores(""); });
document.getElementById("buscaHistorico")?.addEventListener("input", e=>renderizarHistorico(e.target.value));
document.getElementById("btnLimparHistorico")?.addEventListener("click", ()=>{ document.getElementById("buscaHistorico").value=""; renderizarHistorico(""); });
document.getElementById("btnSelecionarArquivo")?.addEventListener("click", ()=>document.getElementById("fileInput").click());

// Adicionar efeito ripple aos botões
document.querySelectorAll('.btn-adicionar, .btn-primary, .btn-cancel, .btn-login').forEach(btn => {
    btn.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        ripple.classList.add('btn-ripple');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${e.clientX - rect.left - size/2}px`;
        ripple.style.top = `${e.clientY - rect.top - size/2}px`;
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });
});

// Garantir placeholder invisível para todos os campos
document.querySelectorAll('.input-group input').forEach(input => {
    if(!input.getAttribute('placeholder')) {
        input.setAttribute('placeholder', ' ');
    }
});

// Forçar placeholder invisível no campo matrícula
const matriculaField = document.getElementById("matricula");
if(matriculaField) {
    matriculaField.setAttribute("placeholder", " ");
}

// Inicialização
verificarSessao();
initTheme();
createParticles();