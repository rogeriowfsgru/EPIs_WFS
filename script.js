// EPI Control WFS - SISTEMA COMPLETO
// VERSÃO CORRIGIDA - ABAS FUNCIONANDO, EDIÇÃO ESTOQUE SOMENTE ADMIN

let usuarioAtual = null;
let colaboradores = [];
let estoque = {};
let movimentacoes = [];
let carrinho = [];
let solicitacoesItens = [];
let solicitacoes = [];
let editando = null;
let colaboradorSelecionado = null;
let colaboradorSolicSelecionado = null;

// ============ BASE64 DO LOGO ============
const LOGO_BASE64 = "AAABAAEAICAAAAEAIACoEAAAFgAAACgAAAAgAAAAQAAAAAEAIAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAACFf/8AhX//AIV//wCFf/8Ak4T/AKSf/wDG0s8Aj3z/AFhr/wB8d/8DZE/zB7u+/w3Y3f8C1dn/AGVM/wCFef8Cemv5BVMy/wceAP8OKAD/DRsA/w13U/8IaFH/BqmW8QCepf8AkoP/AN3S/wDi5NoAmpLSAMe//wDHv/8AAAAAAIV//wCFf/8AhX//AIV//wCThP8ApJ//AMbSzwCPfP8AYXf/AoaB/0ZbRvmHubv/D87U/wKWhP8Aa1L/AJOG+i+IePRkXTj/hyMA/6QpAP+iIQD/olox/5F0W/9wuafoDqqz/wCSg/8A3dL/AOLk2gCaktIAx7//AMe//wAAAAAAhX//AIV//wCFf/8AhX//AJOE/wCkn/8A3u69AKOO/zQYJ/+vJR7/45R+1p22uf8A2+b+AINk/zZJMf+YNC3/xS4o/+YdDv/8FwD//xcA//8WAP//EwL//yYc/+1UPv+wY2D/maWW/yXw6fsA4uTaAJqS0gDHv/8Ax7//AAAAAACFf/8AhX//AIV//wCFf/8Ak4T/ALOw/wGBgvRfT0P/xAAA//9iWf+jwKitI9LT+gCbkP9OTzn/xA8C//8AAP//AAD//wAA//8AAP//AAD//wEA//8AAP//AAD//wAA//8FAP//XEv/tLKV/0f2+8kWmpLSAMe//wDHv/8AAAAAAIV//wCFf/8AhX//AIV//wCcjf8KhX3/cAAA//0AAP//cEf/nvrv6wC7rcYAl4//XSQD//AAAP//AAD//wEA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//LQn/3Lmz9JOjm80Ax7//AMe//wAAAAAAg3z/AIN8/wCEf/8AhoH/AIV2/2sYBv/+AAD//yAj/+fHuv4G4db2AJ+h+VcBAP//BAD//wMA//8BAP//BQD//wAA//8FBP/0JAT/7R0E/+0cCf/uGgL/8QsB//gAAP//AAH//wAA//8AAP//JAr//o2E2TrJwf8Ax77/AAAAAACDfP8Ag3z/AIR//wCGgf8OFgn/7gIA//8BAP//gpP/dca5/wDMvPYDNzL/zAAA//8BAP//BQD//wAA//8OAP//KBj/3G1i/5R5Sf9fb0v/ZI98/2ZZK/9/RSrzrAgA//8BAP//AAD//wEA//8BAP//Jxb/ucrC/wfHvv8AAAAAAL/S4gC/0uIAmXr/AGZH/5oAAP//AAD//ycg/9yYr/8Pzcv/AHJk/3wBAP//AQD//wMA//8AAP//KQT//Fc+/3yek/82dGT/GY9W/waBWv8As5//AGkz/wY9HuMhhWf/exgA//8AAP//AwH//wMA//8EAP/9k4P/ZdDX/wAAAAAA2/u4ANv7uACwgf8bKwP//wEA//8AAP//nY//hoaM/wCurv8cCQX/8gAA//8FAP//BQD//xEH//CehP9geGD/Bvf2vgDKxOIAbkz9AGhM/VpwXf9EYEH/F8Kz7wDEpf8FlXz/cgAA//8AAP//CAD//wsA//8hFv/j5PL/AAAAAADc+rwA3Pq8Anhc/4YGAP//AwD//wYA///byvIjp5r/AHhz/3kAAP//BAD//wIA//8AAP//nYr/Y9bS/wBtVf8A//+gAf//qQF+ev4AiYL2mQgC/+QxIf+z2cb/R5B0/wDZ0f8AclP/sQAA//8HAP//DwD//wAA//+wuf84AAAAAL3X2AC919gQKB//5QQA//8BAP//KgL/9M7C+ADVyPgARDP/2wEA//8NAP//AQD//woD/+b/6P8Awrj/AGNJ/wD//6cA//+xAM7R/wC1uP8yAQD//wIA//82HP/ebFD/I9DD/wDjyf8WFhD/6ggA//8KAP//AgD//01M/6QAAAAAd3//AHd//yYfDv/8BQD//wEA//9FNf+2xrD/AMaw/wcVAP//CQD//wkA//8IAP/+YVn/dfDd/wDNxP8Afmn/AP//qQD//7EA//+uALq7/wBVQv+xAQD//wAA//9gR/+w1cv/Bs+x/wBqUP+gCQD//wMA//8IAP//JBj/2wAAAABtXP8AbVz/SAgA//8GAP//AQD//2Bh/3iaUf8AmlH/LREA//8EAP//BgD//xoA//DFv+ko/fuWBPj4mADw7Z0A//+vAP//sQD//68B9vfCAJOO/04AAP//AAD//wUC//mrsf8xyJb/ALuK/18QAP/9AQH//wMA//8kDf/3AAAAAGlG/wBpRv+EAQD//wIA//8BAP//fIT/VyEA/wAhAP9FGAD//wEA//8GAP//Owv/0/Xrww///6MF//+jAP//pwD//7QA//+0AP//swD//7EBybv/HgAA//8AAf//AAD//3R2/5FlT/8A2aL/EBgA//0AAf//AgD//ycM//0AAAAAQA7/AEAO/6cCAP//AAD//wIA//+Ehv9NAQD/AAEA/0sdAP//AAD//wMA//9HLv/J4urcC///wwH//8MA///GAP//ogD//54A//+nAP//qQTj5/8aBgD//wgA//8EAP//JhT/76S06ACAU/8APhf/5gAA//8FAP//HAX//gAAAAAAAP8AAwD/qgcA//8BAP//AgD//4N7/1CiifIAj3j1OAoA//8AAP//CwD//0cz/83K0foJ/Py2APz8tgD//6wA//+RAP//iwD//6AA//+PA8HX/xwcAf//EQD//xUA//8AAP////+cAT8h/wBWNv/HAAD//w0A//8TAf//AAAAADw+/wACAP+lCwD//wQA//8BAP//c2j/e824/wD/7PgVAQD//wAA//8YAP//VCv/yNjP+wf7+LUC+/i0AP//kQD//5UA//+RAP//mgDr5MkAoZ7/GCkB//8DAP//EAD//wAA///a78IFWUT/AFlE/7YAAP//DgD//xcF//4AAAAA8P+eAEUf/4kEAP//BQD//wEA//9FPP/IUkz/ANvD/wApGP/oAAD//wsA//9SLf/M3OP/CP/+uAH//LwA//+TAP//lQT//5EC//+TAKiP/wCtlv8fGgD//wEA//8FAP//BwD//66+8wdVPv8AWUL/uwAA//8GAP//IAv/+gAAAADu/qEBnJX/UgAA//8DAP//AgD//xUL//qiqf8Ak3H/AH1d/4sAAP//AAD//yYW/+mrvv8c//+3AP3/vwD//40A//+PEf//iwf//6cAnI//AKGW/0UHAP//BgD//wIA//8eAv//r7/zATsa/wBAIP/bAgD//wEA//8oDv/4AAAAAPD+nwCzw/8tCAD//wEA//8DAP//AQD//8fS8ijHvvMAwrH8JBsB//0AAP//AQD//YyD/066ovoA/f+/AfX/pQD//4EK//9/BP//rAG5xPkAZkf/pgoA//8NAP//AAD//0gq/+FpVv8AkYX/ACEC//UKAP//CAD//x0N/+gAAAAAydrFALHG5hErFv/pBgD//wQA//8CAP//aGP/qP//vADQyOEAdUz/cwsA//8AAP//ORj/z5h3/wD9/8EB7/+xAv7/iwP//2AA//+cAN332QYlAf/3DQD//wsA//8AAP//hGf/joFt/wDKy/8sFQD//wsA//8JAP//Pjf/tQAAAACpvN0AscXQAXBo/6QHAP//DQD//wUA//8BAP//rqX9Xeni7QCXbv8Ael3/iDRD/+QrEf//n3z/Rv//sQD3/68E/v+pBNnpwQD38NYAkIr/iQkA//8EAP//BAD//wAA///Gsf85yMj8AJaJ/38JAP//BAD//wAA//+tsPxRAAAAAK/G0wCvxtMAo5z/Rg8A//8IAP//AgD//wAA//8eEP/qwbv/OrGd/wDPvf8AmsX/W1tM/6aZbf9W2tPZAP//rwD//7EAodD/DIt//18RAP//BwD//wMB//8AAP//NCv/0u3j+w3Z2M0BPiv/xAIA//8HAP//GwX/5/j/0wMAAAAAssHfALLB3wCflf8AUjf/vwAA//8AAP//BwD//wAA//8sKP/Wyc//OrCd/w+Cmv8AZlL/AJx1/wBqS/8E7OnFC+7qwxOUs/9uCgP/7gEA//8HAP//BQD//wEA//2BZv9s1sb/AMK+5DYJBf/7CAD//xsA//2Aav9x6PDhAAAAAAC6rf8Auq3/ALeo/wCvnP84AAD//wEA//8GAP//AQD//wAA//49H//hY037iVIw/z+igv8hmHv/KGtM/zxWOf9wX0P/pygS/+wEAP//AwD//wEA//8AAP//NjT/1YBl/wuSbv8AYlX/oQAA//8BAP//NRn/1tfY/xbi5v4AAAAAALOd/wCznf8AtaD/AMOz/wBva/+OAAD//wAA//8BAP//AAD//wAA//8PAv/xHQD/2Ekk/848If/PKxH/1QIA/+gBAP/8CQD//w0A//8AAP//AAD//wsA//+mrf9PprH/AI9k/0ILAv/1AAD//wQF//+eq/9S6O//AODk/wAAAAAA4tzoAOLc6ADi3OgAsZ3/AKWi9xF3ZP+dDgD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8CAP//AAD//wAA//8wJP/lkHj/aNbl/wDO8uwDPir/xwAA//8VAP/tSVftfcHh/wDe4f8A3uH/AAAAAAD//7MA//+zAP//swDXzfUAhoT/AMzB/xJsTP+GMiD/3gEA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8DAv//OjL/xVY9/1bfyv8AvLP/G2xs/6QAAP//MSv/5KyU+nxgd9AA1ObmAOrv5QDq7+UAAAAAAP7/vAD+/7wA/v+8AP//rwGwr+8Atqr/AKWP/wCDZP9XXTf/vSAT/+QLBf/9EwP//wcA//8DAP//BwL//wwG//wRCf/5JCP/3Gdd/5iekP8veGv/AMCz/xF8Yf+gKAL/9UpT/7ODf/9g//+LE5Cd0QD//68A+/+vAPv/rwAAAAAA/v+8AP7/vAD+/7wB//+5Avr7vQC2qv8Am4T/AHda/wS1pf8iZWPydkIu/71AH//GJgf/4yEG/+cfCf/VRTf/uUw//7Kalf9hsq//Co+C/wLN0uYArLP0ND00/8WAaf9kus3/Hndz/wX//6MJ+fqvAfj/twH4/7cA+P+3AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/4YB//8GAP/+GAA/+BAAD/BgAA/wQAAH4IAAA+CAGAPBAOIDgQMhgYMH4IGCB/BBggPQQYID4EGCA+BhggfgIYID8CGDAzAhAwcwIYEFEGGBhGBBgMJgQcBjgAHgHACD4AAAg/AAAQfwAAIP+AAEH+4ACB/OAAgH//////////8=";

// ============ FUNÇÕES DE APOIO ============
function obterDataHora() { const n = new Date(); return `${n.getDate().toString().padStart(2,'0')}/${(n.getMonth()+1).toString().padStart(2,'0')}/${n.getFullYear()} ${n.getHours().toString().padStart(2,'0')}:${n.getMinutes().toString().padStart(2,'0')}:${n.getSeconds().toString().padStart(2,'0')}`; }
function obterData() { const n = new Date(); return `${n.getDate().toString().padStart(2,'0')}/${(n.getMonth()+1).toString().padStart(2,'0')}/${n.getFullYear()}`; }
function mostrarFeedback(msg, tipo) { const div = document.getElementById("feedbackMsg"); if (!div) return; div.style.display = "flex"; div.className = `feedback-toast ${tipo}`; div.innerHTML = `<i class="fas ${tipo==='success'?'fa-check-circle':tipo==='error'?'fa-exclamation-circle':'fa-info-circle'}"></i><span>${msg}</span>`; setTimeout(() => { div.style.animation = 'slideOutRight 0.3s ease-out'; setTimeout(() => { div.style.display = "none"; div.style.animation = ''; }, 300); }, 3000); }

// ============ AUTENTICAÇÃO ============
function carregarUsuarios() {
    let usuarios = localStorage.getItem("usuarios_wfs");
    if (!usuarios) {
        const admin = { id: 1, nome: "Administrador", usuario: "admin", email: "admin@wfs.com", senha: "admin123", nivel: "admin", dataCriacao: new Date().toISOString() };
        localStorage.setItem("usuarios_wfs", JSON.stringify([admin]));
        return [admin];
    }
    return JSON.parse(usuarios);
}
function salvarUsuarios(usuarios) { localStorage.setItem("usuarios_wfs", JSON.stringify(usuarios)); }
function fazerLogin() {
    const usuario = document.getElementById("loginUsuario").value.trim();
    const senha = document.getElementById("loginSenha").value;
    const alertDiv = document.getElementById("loginAlert");
    if (!usuario || !senha) { alertDiv.style.display = "block"; alertDiv.className = "alert alert-error"; alertDiv.innerHTML = "Preencha usuário e senha!"; return; }
    const usuarios = carregarUsuarios();
    const user = usuarios.find(u => u.usuario === usuario && u.senha === senha);
    if (user) {
        usuarioAtual = user;
        localStorage.setItem("usuario_atual_wfs", JSON.stringify(user));
        document.getElementById("loginContainer").style.display = "none";
        document.getElementById("mainSystem").style.display = "block";
        document.getElementById("userNameDisplay").textContent = user.nome;
        document.getElementById("userLevelDisplay").textContent = user.nivel === "admin" ? "Administrador" : "Operador";
        if (user.nivel === "admin") document.querySelectorAll(".admin-only").forEach(el => el.style.display = "flex");
        mostrarFeedback("Bem-vindo, " + user.nome + "!", "success");
        carregarDados();
        carregarSolicitacoes();
        limparTudo();
    } else { alertDiv.style.display = "block"; alertDiv.className = "alert alert-error"; alertDiv.innerHTML = "Usuário ou senha incorretos!<br>Tente admin / admin123"; }
}
function cadastrarUsuario() {
    const nome = document.getElementById("cadNome").value.trim();
    const usuario = document.getElementById("cadUsuario").value.trim();
    const email = document.getElementById("cadEmail").value.trim();
    const senha = document.getElementById("cadSenha").value;
    const confirmar = document.getElementById("cadConfirmar").value;
    const nivel = document.getElementById("cadNivel").value;
    const alertDiv = document.getElementById("cadastroAlert");
    if (!nome || !usuario || !email || !senha) { alertDiv.style.display = "block"; alertDiv.className = "alert alert-error"; alertDiv.innerHTML = "Preencha todos os campos!"; return; }
    if (senha !== confirmar) { alertDiv.style.display = "block"; alertDiv.className = "alert alert-error"; alertDiv.innerHTML = "As senhas não coincidem!"; return; }
    if (senha.length < 4) { alertDiv.style.display = "block"; alertDiv.className = "alert alert-error"; alertDiv.innerHTML = "A senha deve ter pelo menos 4 caracteres!"; return; }
    const usuarios = carregarUsuarios();
    if (usuarios.find(u => u.usuario === usuario)) { alertDiv.style.display = "block"; alertDiv.className = "alert alert-error"; alertDiv.innerHTML = "Usuário já existe!"; return; }
    const novoUsuario = { id: Date.now(), nome, usuario, email, senha, nivel, dataCriacao: new Date().toISOString() };
    usuarios.push(novoUsuario);
    salvarUsuarios(usuarios);
    alertDiv.style.display = "block"; alertDiv.className = "alert alert-success"; alertDiv.innerHTML = "Usuário cadastrado com sucesso!";
    setTimeout(() => voltarLogin(), 2000);
}
function recuperarSenha() {
    const email = document.getElementById("recEmail").value.trim();
    const alertDiv = document.getElementById("recuperarAlert");
    const usuarios = carregarUsuarios();
    const user = usuarios.find(u => u.email === email);
    if (!user) { alertDiv.style.display = "block"; alertDiv.className = "alert alert-error"; alertDiv.innerHTML = "E-mail não encontrado!"; return; }
    alertDiv.style.display = "block"; alertDiv.className = "alert alert-success"; alertDiv.innerHTML = `Sua senha é: ${user.senha}`;
}
function mostrarCadastro() { document.getElementById("loginContainer").style.display = "none"; document.getElementById("cadastroContainer").style.display = "flex"; document.getElementById("recuperarContainer").style.display = "none"; }
function mostrarRecuperar() { document.getElementById("loginContainer").style.display = "none"; document.getElementById("cadastroContainer").style.display = "none"; document.getElementById("recuperarContainer").style.display = "flex"; }
function voltarLogin() { document.getElementById("loginContainer").style.display = "flex"; document.getElementById("cadastroContainer").style.display = "none"; document.getElementById("recuperarContainer").style.display = "none"; document.getElementById("loginUsuario").value = ""; document.getElementById("loginSenha").value = ""; document.getElementById("loginAlert").style.display = "none"; }
function fazerLogout() { localStorage.removeItem("usuario_atual_wfs"); document.getElementById("mainSystem").style.display = "none"; document.getElementById("loginContainer").style.display = "flex"; mostrarFeedback("Logout realizado!", "success"); }
function renderizarUsuarios() {
    const container = document.getElementById("listaUsuarios");
    if (!container) return;
    const usuarios = carregarUsuarios();
    if (usuarios.length === 0) { container.innerHTML = "<div class='empty-state'>Nenhum usuário cadastrado</div>"; return; }
    container.innerHTML = usuarios.map(u => `
        <div class="usuario-item">
            <div class="usuario-info">
                <strong>${u.usuario}</strong> - ${u.nome}<br>
                <small>${u.email} | Nível: ${u.nivel === "admin" ? "Administrador" : "Operador"}</small>
            </div>
            <div class="usuario-actions">
                ${u.id !== 1 && usuarioAtual?.nivel === "admin" && u.id !== usuarioAtual?.id ? `
                    <button class="edit-btn" onclick="promoverAdmin(${u.id})"><i class="fas fa-crown"></i> Promover</button>
                    <button class="delete-btn" onclick="deletarUsuario(${u.id})"><i class="fas fa-trash"></i> Excluir</button>
                ` : u.id === 1 ? '<span style="color:var(--text-secondary); font-size:12px">Usuário padrão</span>' : ''}
            </div>
        </div>
    `).join("");
}
function promoverAdmin(id) { const usuarios = carregarUsuarios(); const user = usuarios.find(u => u.id === id); if (user && user.nivel !== "admin") { user.nivel = "admin"; salvarUsuarios(usuarios); renderizarUsuarios(); mostrarFeedback(`Usuário ${user.usuario} promovido a Administrador!`, "success"); } }
function deletarUsuario(id) { if (confirm("Tem certeza que deseja excluir este usuário?")) { let usuarios = carregarUsuarios(); usuarios = usuarios.filter(u => u.id !== id); salvarUsuarios(usuarios); renderizarUsuarios(); mostrarFeedback("Usuário excluído com sucesso!", "success"); } }

// ============ TEMA E PARTÍCULAS ============
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('theme_wfs');
    if (savedTheme === 'light') { document.body.setAttribute('data-theme', 'light'); if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-moon"></i>'; }
    else { document.body.setAttribute('data-theme', 'dark'); if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-sun"></i>'; }
    if (themeToggle) themeToggle.addEventListener('click', () => { const current = document.body.getAttribute('data-theme'); if (current === 'dark') { document.body.setAttribute('data-theme', 'light'); localStorage.setItem('theme_wfs', 'light'); themeToggle.innerHTML = '<i class="fas fa-moon"></i>'; mostrarFeedback('Modo claro ativado', 'info'); } else { document.body.setAttribute('data-theme', 'dark'); localStorage.setItem('theme_wfs', 'dark'); themeToggle.innerHTML = '<i class="fas fa-sun"></i>'; mostrarFeedback('Modo escuro ativado', 'info'); } });
}
function createParticles() {
    const container = document.getElementById('particlesContainer');
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < 80; i++) { const p = document.createElement('div'); p.classList.add('particle'); const s = Math.random() * 6 + 2; p.style.width = s + 'px'; p.style.height = s + 'px'; p.style.left = Math.random() * 100 + '%'; p.style.top = Math.random() * 100 + '%'; p.style.animationDuration = Math.random() * 15 + 8 + 's'; p.style.animationDelay = Math.random() * 10 + 's'; p.style.opacity = Math.random() * 0.5 + 0.1; container.appendChild(p); }
}

// ============ DADOS ============
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
function inicializarEstoque() { listaEPIsBase.forEach(e => { if (!estoque[e.codigo]) estoque[e.codigo] = { codigo: e.codigo, descricao: e.descricao, quantidade: 10, emUso: 0, ultimaMov: null }; }); }
function carregarDados() { const se = localStorage.getItem("estoque_final12"); if (se) estoque = JSON.parse(se); else { inicializarEstoque(); salvarDados(); } const sm = localStorage.getItem("movs_final12"); if (sm) movimentacoes = JSON.parse(sm); const sc = localStorage.getItem("colabs_final12"); if (sc) colaboradores = JSON.parse(sc); salvarDados(); }
function salvarDados() { localStorage.setItem("estoque_final12", JSON.stringify(estoque)); localStorage.setItem("movs_final12", JSON.stringify(movimentacoes)); localStorage.setItem("colabs_final12", JSON.stringify(colaboradores)); atualizarStats(); renderizarColaboradores(""); renderizarEstoque(); renderizarHistorico(""); preencherSelect(); preencherSelectSolicitacoes(); renderizarUsuarios(); }
function atualizarStats() { const totalEPIs = Object.keys(estoque).length; const totalMovs = movimentacoes.length; const ativos = new Set(movimentacoes.filter(m => m.tipo === "saida" && !m.devolvido).map(m => m.matricula)); const el1 = document.getElementById("totalEPIs"); const el2 = document.getElementById("totalMovs"); const el3 = document.getElementById("totalAtivos"); if (el1) el1.textContent = totalEPIs; if (el2) el2.textContent = totalMovs; if (el3) el3.textContent = ativos.size; }

// ============ NAVEGAÇÃO DAS ABAS ============
function ativarAba(abaId) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    const btnAtivo = document.querySelector(`.tab-btn[data-tab="${abaId}"]`);
    if (btnAtivo) btnAtivo.classList.add('active');
    const conteudoAtivo = document.getElementById(`tab-${abaId}`);
    if (conteudoAtivo) conteudoAtivo.classList.add('active');
}
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        const aba = this.getAttribute('data-tab');
        ativarAba(aba);
        if (aba === 'movimentacoes') renderizarHistorico("");
        if (aba === 'usuarios') renderizarUsuarios();
        if (aba === 'estoque') renderizarEstoque();
        if (aba === 'solicitacoes') { carregarSolicitacoes(); preencherSelectSolicitacoes(); }
        if (aba === 'requerimento') limparTudo();
    });
});

// ============ FUNÇÕES GERAIS ============
function limparTudo() { const campo = document.getElementById("matricula"); if (campo) campo.value = ""; colaboradorSelecionado = null; document.getElementById("infoColaborador").style.display = "none"; document.getElementById("autocompleteList").style.display = "none"; atualizarFichaEPIs(); }
function selecionarColab(mat, nome, funcao, secao) { const campo = document.getElementById("matricula"); if (campo) campo.value = mat; colaboradorSelecionado = { matricula: mat, nome: nome, funcao: funcao, secao: secao }; document.getElementById("autocompleteList").style.display = "none"; document.getElementById("infoNome").textContent = nome; document.getElementById("infoFuncao").textContent = funcao || "---"; document.getElementById("infoSecao").textContent = secao || "---"; document.getElementById("infoColaborador").style.display = "block"; atualizarFichaEPIs(); mostrarFeedback(`✅ Colaborador ${nome} selecionado!`, "success"); }
function atualizarFichaEPIs() {
    const mat = colaboradorSelecionado ? colaboradorSelecionado.matricula : document.getElementById("matricula").value;
    const btnPDF = document.getElementById("btnGerarFichaPDF");
    const fichaDiv = document.getElementById("fichaConteudo");
    if (!mat || !colaboradorSelecionado || !colaboradorSelecionado.nome) { if (fichaDiv) fichaDiv.innerHTML = '<div class="empty-state"><i class="fas fa-user-search"></i><p>Selecione um colaborador acima para ver os EPIs em uso</p></div>'; if (btnPDF) btnPDF.style.display = "none"; return; }
    const itensCarrinho = carrinho.filter(item => item.codigo).map(item => ({ descricaoEPI: item.descricao, quantidade: item.quantidade, dataHora: "AGORA - SENDO REQUERIDO" }));
    if (itensCarrinho.length === 0) { fichaDiv.innerHTML = `<div class="empty-state" style="padding:30px;"><i class="fas fa-info-circle" style="color:#ff6b35; font-size:48px;"></i><p><strong>${colaboradorSelecionado.nome}</strong> não possui nenhum EPI sendo requerido no momento.</p><p style="font-size:12px; margin-top:10px;">Adicione EPIs ao carrinho acima para aparecerem aqui.</p></div>`; if (btnPDF) btnPDF.style.display = "none"; return; }
    let listaHtml = '<div class="info-card" style="margin-bottom:15px;"><div><strong><i class="fas fa-user"></i> Colaborador:</strong> ' + colaboradorSelecionado.nome + '<br><strong><i class="fas fa-id-card"></i> Matrícula:</strong> ' + colaboradorSelecionado.matricula + '<br><strong><i class="fas fa-briefcase"></i> Função:</strong> ' + (colaboradorSelecionado.funcao || '---') + '<br><strong><i class="fas fa-building"></i> Seção:</strong> ' + (colaboradorSelecionado.secao || '---') + '</div></div><hr class="divisor"><h3 style="margin:15px 0 10px 0;"><i class="fas fa-hard-hat"></i> EPIs SENDO REQUERIDOS AGORA:</h3>';
    itensCarrinho.forEach(e => { listaHtml += `<div class="ficha-epi-item" style="border-left-color: var(--warning);"><div class="epi-info"><strong>${e.descricaoEPI}</strong><small>${e.dataHora} | Quantidade: ${e.quantidade}</small></div><span class="badge badge-warning"><i class="fas fa-clock"></i> AGUARDANDO FINALIZAÇÃO</span></div>`; });
    fichaDiv.innerHTML = listaHtml; if (btnPDF) btnPDF.style.display = itensCarrinho.length > 0 ? "block" : "none";
}
function gerarPDF(html, nomeArquivo) { const blob = new Blob([html], { type: 'text/html' }); const url = URL.createObjectURL(blob); const win = window.open(url, '_blank'); if (!win) { mostrarFeedback("❌ PERMITA POP-UPS NESTE SITE!", "error"); return; } setTimeout(() => URL.revokeObjectURL(url), 1000); }

// ============ FICHA PDF COM LOGO ============
function gerarFichaPDF() {
    if (!colaboradorSelecionado) { mostrarFeedback("⚠️ Selecione um colaborador primeiro!", "error"); return; }
    const colab = colaboradorSelecionado;
    const itensCarrinho = carrinho.filter(item => item.codigo).map(item => ({ descricaoEPI: item.descricao, quantidade: item.quantidade, dataHora: obterDataHora() }));
    let tabelaEPIs = '';
    if (itensCarrinho.length === 0) tabelaEPIs = '<tr><td colspan="3" style="text-align:center; padding:10px;">Nenhum EPI sendo requerido no momento<th>';
    else itensCarrinho.forEach(e => { tabelaEPIs += `<tr><td style="padding:6px">${e.dataHora}</td><td style="padding:6px">${e.descricaoEPI}</td><td style="text-align:center; padding:6px">${e.quantidade}</td></tr>`; });
    const dataAtual = new Date().toLocaleString('pt-BR');
    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>FICHA DE EPIs - ${colab.nome}</title><style>*{margin:0;padding:0;box-sizing:border-box}@page{size:A4;margin:1.2cm}body{font-family:'Times New Roman',Arial;font-size:9pt;line-height:1.3;color:#000}.logo{text-align:center;margin-bottom:8px}.logo img{height:45px}h1{font-size:14pt;color:#c41e3a;text-align:center;margin-bottom:4px}h2{font-size:12pt;text-align:center;border-bottom:2px solid #c41e3a;padding-bottom:3px;margin-bottom:8px}h3{font-size:10pt;margin:6px 0;background:#f0f0f0;padding:3px}.info-box{background:#f9f9f9;border:1px solid #ddd;padding:6px;margin:6px 0;border-radius:4px}.info-box p{margin:2px 0}table{width:100%;border-collapse:collapse;margin:8px 0}th{background:#c41e3a;color:white;padding:4px;text-align:left;font-size:9pt}td{border:1px solid #999;padding:4px;font-size:8pt}.termo{border:1px solid #000;padding:5px;margin:8px 0;text-align:justify;font-size:7.5pt;line-height:1.2}.termo h4{text-align:center;margin-bottom:4px;font-size:9pt}.termo p{margin-bottom:3px}.assinatura{display:flex;justify-content:space-between;margin-top:12px}.linha-assinatura{text-align:center;width:45%}.linha{border-top:1px solid #000;margin:10px auto 3px auto;width:100%}.footer{font-size:6.5pt;text-align:center;margin-top:10px;border-top:1px solid #ccc;padding-top:4px;color:#666}</style></head><body><div class="logo"><img src="data:image/x-icon;base64,${LOGO_BASE64}" alt="WFS"></div><h1>EPI Control WFS</h1><h2>FICHA DE EPIs E TERMO DE RESPONSABILIDADE</h2><div class="info-box"><p><strong>📌 DADOS DO COLABORADOR</strong></p><p><strong>Matrícula:</strong> ${colab.matricula} | <strong>Nome:</strong> ${colab.nome}</p><p><strong>Função:</strong> ${colab.funcao || '---'} | <strong>Seção:</strong> ${colab.secao || '---'}</p><p><strong>Data Admissão:</strong> ${colab.dataAdmissao || '---'} | <strong>Data Emissão:</strong> ${dataAtual}</p></div><h3>📋 EPIs SENDO REQUERIDOS</h3><table border="1"><thead><tr><th style="width:130px">Data/Hora</th><th>EPI - Descrição</th><th style="width:60px">Qtd</th></tr></thead><tbody>${tabelaEPIs}</tbody></table><div class="termo"><h4>TERMO DE RESPONSABILIDADE - EQUIPAMENTOS DE PROTEÇÃO INDIVIDUAL (EPIs)</h4><p>Pelo presente termo, eu, <strong>${colab.nome}</strong>, portador da matrícula <strong>${colab.matricula}</strong>, declaro ter recebido da empresa os Equipamentos de Proteção Individual (EPIs) acima relacionados, comprometendo-me a:</p><p><strong>1. UTILIZAÇÃO CORRETA:</strong> Utilizar os EPIs exclusivamente para a finalidade a que se destinam, durante toda a execução das minhas atividades laborais, conforme orientações recebidas nos treinamentos e instruções da NR-06.</p><p><strong>2. GUARDA E CONSERVAÇÃO:</strong> Responsabilizar-me pela guarda, conservação e integridade dos equipamentos, mantendo-os em perfeito estado de uso, higienizando-os conforme orientação técnica e armazenando-os adequadamente quando não estiverem em uso.</p><p><strong>3. COMUNICAÇÃO DE DANOS:</strong> Comunicar imediatamente à empresa qualquer alteração, dano, defeito ou desgaste que torne o EPI impróprio para uso, para que seja providenciada a imediata substituição.</p><p><strong>4. DEVOLUÇÃO DOS EPIs:</strong> Devolver os EPIs quando apresentarem desgaste natural, quando forem substituídos por novos modelos ou, ainda, no término do meu contrato de trabalho, em bom estado de conservação.</p><p><strong>5. HIGIENE E MANUTENÇÃO:</strong> Higienizar e armazenar corretamente os EPIs conforme orientações recebidas no treinamento, utilizando os produtos e métodos adequados para cada tipo de equipamento.</p><p><strong>6. RESPONSABILIDADE POR EXTRAVIO/DANO:</strong> Estou ciente de que, em caso de dano ocasionado por negligência, mau uso, extravio, perda ou furto comprovado por negligência, terei a obrigação de comunicar imediatamente à empresa e providenciar a respectiva reposição, conforme previsto nas normas trabalhistas vigentes.</p><p><strong>7. TREINAMENTO RECEBIDO:</strong> Declaro que recebi treinamento adequado sobre a utilização correta, higienização, guarda e manutenção dos EPIs, bem como fui cientificado da obrigatoriedade do seu uso, das sanções administrativas e disciplinares em caso de não utilização, e das consequências previstas na legislação trabalhista (NR-06, item 6.7.1, alínea "a").</p><p><strong>8. FUNDAMENTAÇÃO LEGAL:</strong> Este termo está em conformidade com os dispositivos da <strong>NR-01 (item 1.4.2, alínea "d", e item 1.4.2.1)</strong>, bem como da <strong>NR-06 (itens 6.7 e 6.7.1, alíneas "a", "b", "c" e "d")</strong> da Portaria nº 3.214, de 08/06/78, do MTE, além do disposto nos arts. 157, 158, 166 e 167 da <strong>CLT (Consolidação das Leis do Trabalho)</strong>.</p><p><strong>9. CIÊNCIA DAS PENALIDADES:</strong> Estou ciente de que o não cumprimento das obrigações aqui estabelecidas sujeita o infrator às penalidades previstas na legislação trabalhista, podendo ensejar medidas disciplinares conforme disposto no contrato de trabalho e nas normas internas da empresa.</p><p><strong>10. CONCORDÂNCIA:</strong> Por fim, reafirmo minha concordância e responsabilidade quanto ao cumprimento integral das obrigações aqui descritas, assumindo o compromisso de zelar pela minha segurança e saúde ocupacional, bem como pela integridade dos equipamentos confiados à minha guarda.</p><p style="margin-top:4px"><em>Declaro que li e compreendi todas as cláusulas deste termo, estando de acordo com seu conteúdo e comprometendo-me a cumpri-lo integralmente.</em></p></div><div class="assinatura"><div class="linha-assinatura"><div class="linha"></div><p><strong>${colab.nome}</strong><br>Colaborador / Funcionário</p></div><div class="linha-assinatura"><div class="linha"></div><p><strong>Empresa WFS</strong><br>Responsável pela Entrega</p></div></div><div class="footer">Documento gerado eletronicamente pelo sistema EPI Control WFS em ${dataAtual}<br>NR-06 - Equipamentos de Proteção Individual | NR-01 - Disposições Gerais | CLT - Artigos 157, 158, 166 e 167</div></body></html>`;
    gerarPDF(html, `ficha_epis_${colab.matricula}.pdf`);
    mostrarFeedback("📄 Ficha PDF gerada com Termo de Responsabilidade completo!", "success");
}

// ============ REQUERIMENTO ============
function preencherSelect() { const s = document.getElementById("epiSelect"); if (!s) return; s.innerHTML = '<option value="" disabled selected>Selecione um EPI</option>'; Object.values(estoque).sort((a,b) => a.descricao.localeCompare(b.descricao)).forEach(e => { const o = document.createElement("option"); o.value = e.codigo; o.textContent = `${e.descricao} (${e.codigo}) - Estoque: ${e.quantidade}`; s.appendChild(o); }); }
function adicionarRequerimento() { const cod = document.getElementById("epiSelect").value; const qtd = parseInt(document.getElementById("quantidade").value); if (!cod) { mostrarFeedback("Selecione um EPI!", "error"); return; } if (isNaN(qtd) || qtd < 1) { mostrarFeedback("Quantidade inválida!", "error"); return; } const est = estoque[cod]; if (!est) { mostrarFeedback("EPI não encontrado!", "error"); return; } if (est.quantidade < qtd) { mostrarFeedback(`Estoque insuficiente! Disponível: ${est.quantidade}`, "error"); return; } const exist = carrinho.find(r => r.codigo === cod); if (exist) exist.quantidade += qtd; else carrinho.push({ codigo: cod, quantidade: qtd, descricao: est.descricao }); atualizarCarrinho(); document.getElementById("quantidade").value = "1"; mostrarFeedback(`✅ ${est.descricao} adicionado!`, "success"); atualizarFichaEPIs(); }
function atualizarCarrinho() { const div = document.getElementById("carrinhoLista"); const span = document.getElementById("totalCarrinho"); if (!div) return; if (carrinho.length === 0) { div.innerHTML = '<div class="empty-state" style="padding:20px;"><i class="fas fa-inbox"></i> Nenhum EPI adicionado</div>'; if (span) span.textContent = "0 itens"; return; } const total = carrinho.reduce((s,i) => s + i.quantidade, 0); if (span) span.textContent = `${total} item(s)`; div.innerHTML = carrinho.map((item, idx) => `<div class="carrinho-item"><div><strong>${item.descricao}</strong><br>Qtd: ${item.quantidade}</div><button class="btn-remover-carrinho" onclick="removerItem(${idx})"><i class="fas fa-trash"></i> Remover</button></div>`).join(""); }
function removerItem(idx) { carrinho.splice(idx, 1); atualizarCarrinho(); atualizarFichaEPIs(); mostrarFeedback("Item removido", "success"); }
function finalizarRequerimento() { let mat = colaboradorSelecionado ? colaboradorSelecionado.matricula : document.getElementById("matricula").value; if (!mat) { mostrarFeedback("⚠️ Selecione um colaborador!", "error"); return; } if (carrinho.length === 0) { mostrarFeedback("⚠️ Adicione pelo menos um EPI ao carrinho!", "error"); return; } let colab = colaboradores.find(c => c.matricula === mat); if (!colab && colaboradorSelecionado) colab = colaboradorSelecionado; if (!colab) { mostrarFeedback(`❌ Colaborador não encontrado!`, "error"); return; } const dh = obterDataHora(); const d = obterData(); let ok = 0; for (const item of carrinho) { const est = estoque[item.codigo]; if (!est || est.quantidade < item.quantidade) continue; est.quantidade -= item.quantidade; est.emUso = (est.emUso || 0) + item.quantidade; est.ultimaMov = dh; movimentacoes.unshift({ id: Date.now(), tipo: "saida", matricula: mat, nomeColab: colab.nome, codigoEPI: item.codigo, descricaoEPI: item.descricao, quantidade: item.quantidade, dataHora: dh, data: d, devolvido: false }); ok++; } if (ok > 0) { mostrarFeedback(`✅ REQUERIMENTO FINALIZADO! ${ok} item(s) retirado(s) por ${colab.nome}`, "success"); carrinho = []; atualizarCarrinho(); salvarDados(); renderizarEstoque(); preencherSelect(); preencherSelectSolicitacoes(); renderizarHistorico(""); atualizarFichaEPIs(); } }
function cancelarRequerimento() { if (carrinho.length && confirm("Cancelar este requerimento?")) { carrinho = []; atualizarCarrinho(); atualizarFichaEPIs(); limparTudo(); mostrarFeedback("Requerimento cancelado!", "success"); } else if (carrinho.length === 0) { limparTudo(); mostrarFeedback("Campos limpos!", "info"); } }
document.getElementById("matricula")?.addEventListener("input", function() { colaboradorSelecionado = null; const val = this.value.toLowerCase(); const lista = document.getElementById("autocompleteList"); if (!val || val.length === 0) { lista.style.display = "none"; document.getElementById("infoColaborador").style.display = "none"; atualizarFichaEPIs(); return; } const filtrados = colaboradores.filter(c => c.matricula.toLowerCase().includes(val) || c.nome.toLowerCase().includes(val)); if (filtrados.length > 0) { lista.innerHTML = filtrados.map(c => `<div class="autocomplete-item" onclick="selecionarColab('${c.matricula}','${c.nome.replace(/'/g, "\\'")}','${c.funcao || ''}','${c.secao || ''}')"><strong>${c.matricula}</strong> - ${c.nome}</div>`).join(""); lista.style.display = "block"; lista.style.width = this.offsetWidth + "px"; } else { lista.style.display = "none"; } });

// ============ ESTOQUE ============
function renderizarEstoque() {
    const tbody = document.getElementById("estoqueBody");
    if (!tbody) return;
    const ordenados = Object.values(estoque).sort((a,b) => a.descricao.localeCompare(b.descricao));
    tbody.innerHTML = "";
    for (const e of ordenados) {
        const row = tbody.insertRow();
        if (e.quantidade === 0) row.style.backgroundColor = "#2a1a1a";
        else if (e.quantidade <= 5) row.style.backgroundColor = "#2a2a1a";
        row.insertCell(0).innerHTML = `<strong>${e.codigo}</strong>`;
        row.insertCell(1).innerHTML = e.descricao;
        const badgeClass = e.quantidade === 0 ? 'badge-danger' : (e.quantidade <= 5 ? 'badge-warning' : 'badge-success');
        row.insertCell(2).innerHTML = `<span class="badge ${badgeClass}">${e.quantidade} unidades</span>`;
        const statusText = e.quantidade === 0 ? 'Esgotado' : (e.quantidade <= 5 ? 'Baixo estoque' : 'Disponível');
        row.insertCell(3).innerHTML = `<span class="badge ${badgeClass}">${statusText}</span>`;
        row.insertCell(4).innerHTML = e.emUso > 0 ? `${e.emUso} em uso` : '---';
        row.insertCell(5).innerHTML = e.ultimaMov || '---';
        if (usuarioAtual && usuarioAtual.nivel === "admin") {
            row.insertCell(6).innerHTML = `<button class="edit-btn" onclick="editarEPI('${e.codigo}')"><i class="fas fa-edit"></i> Editar</button>`;
        } else {
            row.insertCell(6).innerHTML = `<span style="color:var(--text-muted); font-size:11px;">---</span>`;
        }
    }
}
function salvarEPI() {
    if (!usuarioAtual || usuarioAtual.nivel !== "admin") { mostrarFeedback("❌ Apenas administradores podem editar o estoque!", "error"); return; }
    const cod = document.getElementById("epiCodigo").value.trim();
    const desc = document.getElementById("epiDescricao").value.trim();
    const qtd = parseInt(document.getElementById("epiQtd").value);
    if (!cod || !desc) { mostrarFeedback("Preencha código e descrição!", "error"); return; }
    if (isNaN(qtd) || qtd < 0) { mostrarFeedback("Quantidade inválida!", "error"); return; }
    if (editando) {
        if (editando !== cod && estoque[cod]) { mostrarFeedback("Código já existe!", "error"); return; }
        const antigo = estoque[editando];
        delete estoque[editando];
        estoque[cod] = { codigo: cod, descricao: desc, quantidade: qtd, emUso: antigo?.emUso || 0, ultimaMov: antigo?.ultimaMov || obterDataHora() };
        mostrarFeedback(`✅ EPI editado!`, "success");
        editando = null;
    } else {
        if (estoque[cod]) { estoque[cod].quantidade += qtd; if (desc) estoque[cod].descricao = desc; mostrarFeedback(`✅ Estoque atualizado!`, "success"); }
        else { estoque[cod] = { codigo: cod, descricao: desc, quantidade: qtd, emUso: 0, ultimaMov: obterDataHora() }; mostrarFeedback(`✅ EPI cadastrado!`, "success"); }
    }
    salvarDados(); renderizarEstoque(); preencherSelect(); preencherSelectSolicitacoes(); limparEPI();
}
function editarEPI(cod) {
    if (!usuarioAtual || usuarioAtual.nivel !== "admin") { mostrarFeedback("❌ Apenas administradores podem editar o estoque!", "error"); return; }
    const e = estoque[cod];
    if (e) { document.getElementById("epiCodigo").value = e.codigo; document.getElementById("epiDescricao").value = e.descricao; document.getElementById("epiQtd").value = e.quantidade; editando = cod; mostrarFeedback(`✏️ Editando: ${e.descricao}`, "info"); }
    else { mostrarFeedback("EPI não encontrado!", "error"); }
}
function limparEPI() { document.getElementById("epiCodigo").value = ""; document.getElementById("epiDescricao").value = ""; document.getElementById("epiQtd").value = ""; editando = null; }
function renderizarHistorico(filtro = "") { const cont = document.getElementById("listaHistorico"); if (!cont) return; let dados = [...movimentacoes]; if (filtro) dados = dados.filter(m => m.matricula.toLowerCase().includes(filtro.toLowerCase()) || m.nomeColab.toLowerCase().includes(filtro.toLowerCase())); if (dados.length === 0) { cont.innerHTML = '<div class="empty-state"><i class="fas fa-inbox"></i><p>Nenhum movimento encontrado</p></div>'; return; } cont.innerHTML = dados.map(m => `<div class="historico-item"><div style="display:flex; justify-content:space-between; margin-bottom:8px"><strong><i class="fas fa-arrow-right"></i> RETIRADA</strong><span>${m.dataHora}</span></div><div><strong>EPI:</strong> ${m.descricaoEPI} - Qtd: ${m.quantidade}</div><div><strong>Matrícula:</strong> ${m.matricula}</div><div><strong>Colaborador:</strong> ${m.nomeColab}</div></div>`).join(""); }
function renderizarColaboradores(busca = "") {
    const tbody = document.getElementById("colaboradoresTableBody");
    if (!tbody) return;
    if (!busca) { tbody.innerHTML = '<tr><td colspan="7"><div class="empty-state"><i class="fas fa-search"></i><p>Digite matrícula ou nome para buscar</p></div> </td></tr>'; return; }
    const filtrados = colaboradores.filter(c => c.matricula.toLowerCase().includes(busca.toLowerCase()) || c.nome.toLowerCase().includes(busca.toLowerCase()));
    if (filtrados.length === 0) { tbody.innerHTML = '<tr><td colspan="7"><div class="empty-state"><i class="fas fa-user-slash"></i><p>Nenhum colaborador encontrado</p></div> </td></tr>'; return; }
    tbody.innerHTML = "";
    filtrados.forEach(c => {
        const epis = movimentacoes.filter(m => m.matricula === c.matricula && m.tipo === "saida" && !m.devolvido);
        const row = tbody.insertRow();
        row.insertCell(0).innerHTML = `<strong>${c.matricula}</strong>`;
        row.insertCell(1).innerHTML = `<i class="fas fa-user"></i> ${c.nome}`;
        row.insertCell(2).innerHTML = c.secao || '---';
        row.insertCell(3).innerHTML = c.dataAdmissao || '---';
        row.insertCell(4).innerHTML = c.funcao || '---';
        row.insertCell(5).innerHTML = `<span class="badge badge-success">${epis.length} EPI(s)</span>`;
        if (usuarioAtual && usuarioAtual.nivel === "admin") {
            row.insertCell(6).innerHTML = `<button class="edit-btn" onclick="editarColab('${c.matricula}')"><i class="fas fa-edit"></i></button><button class="delete-btn" onclick="deletarColab('${c.matricula}')"><i class="fas fa-trash"></i></button>`;
        } else {
            row.insertCell(6).innerHTML = `<span style="color:var(--text-muted); font-size:11px;">---</span>`;
        }
    });
}
function cadastrarColaborador() { const mat = document.getElementById("cadMatricula").value.trim(); const nom = document.getElementById("cadNome").value.trim(); const sec = document.getElementById("cadSecao").value.trim(); const dat = document.getElementById("cadDataAdmissao").value; const func = document.getElementById("cadFuncao").value.trim(); if (!mat || !nom) { mostrarFeedback("Matrícula e Nome obrigatórios!", "error"); return; } if (colaboradores.find(c => c.matricula === mat)) { mostrarFeedback("Matrícula já existe!", "error"); return; } colaboradores.push({ matricula: mat, nome: nom, secao: sec, dataAdmissao: dat, funcao: func }); salvarDados(); document.getElementById("cadMatricula").value = ""; document.getElementById("cadNome").value = ""; document.getElementById("cadSecao").value = ""; document.getElementById("cadDataAdmissao").value = ""; document.getElementById("cadFuncao").value = ""; mostrarFeedback(`✅ ${nom} cadastrado!`, "success"); }
function editarColab(mat) { if (!usuarioAtual || usuarioAtual.nivel !== "admin") { mostrarFeedback("❌ Apenas administradores podem editar colaboradores!", "error"); return; } const c = colaboradores.find(c => c.matricula === mat); if (c) { document.getElementById("cadMatricula").value = c.matricula; document.getElementById("cadNome").value = c.nome; document.getElementById("cadSecao").value = c.secao || ""; document.getElementById("cadDataAdmissao").value = c.dataAdmissao || ""; document.getElementById("cadFuncao").value = c.funcao || ""; deletarColab(mat, true); mostrarFeedback("Edite e clique em Cadastrar", "info"); } }
function deletarColab(mat, sil = false) { if (!usuarioAtual || usuarioAtual.nivel !== "admin") { mostrarFeedback("❌ Apenas administradores podem excluir colaboradores!", "error"); return; } const c = colaboradores.find(c => c.matricula === mat); if (!c) return; const pend = movimentacoes.filter(m => m.matricula === mat && m.tipo === "saida" && !m.devolvido); if (pend.length && !sil) { mostrarFeedback(`Colaborador tem ${pend.length} EPI(s) pendente(s)!`, "error"); return; } colaboradores = colaboradores.filter(c => c.matricula !== mat); salvarDados(); if (!sil) mostrarFeedback(`🗑️ ${c.nome} removido`, "success"); renderizarColaboradores(document.getElementById("buscaColab").value); }

document.getElementById("uploadArea")?.addEventListener("click", () => document.getElementById("fileInput").click());
document.getElementById("fileInput")?.addEventListener("change", e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
        let content = ev.target.result;
        if (content.charCodeAt(0) === 0xFEFF) content = content.substring(1);
        const linhas = content.split(/\r?\n/);
        let imp = 0;
        for (let i = 0; i < linhas.length; i++) {
            let linha = linhas[i].trim();
            if (!linha) continue;
            if (i === 0 && linha.toLowerCase().includes('matricula')) continue;
            const sep = linha.includes(';') ? ';' : ',';
            let partes = linha.split(sep).map(p => p.trim().replace(/^["']|["']$/g, ''));
            if (partes[0]) {
                const mat = partes[0];
                const nom = partes[1] || `Colab ${mat}`;
                const sec = partes[2] || "";
                const dat = partes[3] || "";
                const func = partes[4] || "";
                if (!colaboradores.find(c => c.matricula === mat)) {
                    colaboradores.push({ matricula: mat, nome: nom, secao: sec, dataAdmissao: dat, funcao: func });
                    imp++;
                }
            }
        }
        if (imp) {
            salvarDados();
            document.getElementById("uploadInfo").innerHTML = `<i class="fas fa-check-circle"></i> ✅ ${imp} importados! Total: ${colaboradores.length}`;
            mostrarFeedback(`✅ ${imp} colaboradores importados!`, "success");
            renderizarColaboradores("");
            document.getElementById("fileInput").value = "";
        } else { mostrarFeedback("Nenhum colaborador importado!", "error"); }
    };
    reader.readAsText(file, "UTF-8");
});

// ============ SOLICITAÇÕES ============
function carregarSolicitacoes() { const saved = localStorage.getItem("solicitacoes_wfs"); solicitacoes = saved ? JSON.parse(saved) : []; renderizarListaSolicitacoes(""); }
function salvarSolicitacoes() { localStorage.setItem("solicitacoes_wfs", JSON.stringify(solicitacoes)); renderizarListaSolicitacoes(document.getElementById("buscaSolicitacoes")?.value || ""); }
function editarObservacaoSolicitacao(solicitacaoId, itemIndex) { const s = solicitacoes.find(s => s.id === solicitacaoId); if (!s) return; if (s.status !== "pendente") { mostrarFeedback("⚠️ Somente solicitações pendentes podem ter observações editadas!", "error"); return; } const item = s.itens[itemIndex]; const novoLaudo = prompt("Edite a observação / laudo:", item.laudo); if (novoLaudo !== null && novoLaudo.trim() !== "") item.laudo = novoLaudo.trim(); else if (novoLaudo !== null && novoLaudo.trim() === "") item.laudo = "Sem observação"; salvarSolicitacoes(); mostrarFeedback("✅ Observação atualizada com sucesso!", "success"); }
function renderizarListaSolicitacoes(filtro = "") { const container = document.getElementById("listaSolicitacoes"); if (!container) return; let dados = [...solicitacoes]; if (filtro) dados = dados.filter(s => s.matricula.toLowerCase().includes(filtro.toLowerCase()) || s.nomeColab.toLowerCase().includes(filtro.toLowerCase())); if (dados.length === 0) { container.innerHTML = '<div class="empty-state"><i class="fas fa-inbox"></i><p>Nenhuma solicitação</p></div>'; return; } container.innerHTML = dados.map(s => `<div class="solicitacao-item"><div style="display:flex; justify-content:space-between;"><div><strong>${s.nomeColab}</strong> (${s.matricula})<br><small>${s.funcao || '---'} | ${s.secao || '---'}</small><br><small>${s.data}</small></div><div><span class="${s.status === 'pendente' ? 'badge-pendente' : 'badge-aprovada'}">${s.status === 'pendente' ? 'PENDENTE' : 'APROVADA'}</span>${usuarioAtual?.nivel === 'admin' && s.status === 'pendente' ? `<button class="btn-aprovar" onclick="aprovarSolicitacao(${s.id})"><i class="fas fa-check"></i> Aprovar</button>` : ''}</div></div><hr><div><strong>Itens:</strong></div>${s.itens.map((item, idx) => `<div style="margin-left:15px; margin-top:5px;"><strong>• ${item.descricao}</strong> - Qtd: ${item.quantidade}<br><span style="font-size:12px;"><i class="fas fa-comment"></i> Laudo: ${item.laudo || "Sem observação"}</span>${usuarioAtual?.nivel === "admin" && s.status === "pendente" ? `<button class="edit-btn" style="margin-left:10px; padding:2px 8px; font-size:10px;" onclick="editarObservacaoSolicitacao(${s.id}, ${idx})"><i class="fas fa-edit"></i> Editar obs</button>` : ''}</div>`).join('')}</div>`).join(""); }
function preencherSelectSolicitacoes() { const s = document.getElementById("epiSelectSolic"); if (!s) return; s.innerHTML = '<option value="" disabled selected>Selecione um EPI</option>'; Object.values(estoque).sort((a,b) => a.descricao.localeCompare(b.descricao)).forEach(e => { s.innerHTML += `<option value="${e.codigo}">${e.descricao} (${e.codigo}) - Estoque: ${e.quantidade}</option>`; }); }
document.getElementById("matriculaSolic")?.addEventListener("input", function() { colaboradorSolicSelecionado = null; const val = this.value.toLowerCase(); const lista = document.getElementById("autocompleteListSolic"); if (!val) { lista.style.display = "none"; document.getElementById("infoColabSolic").style.display = "none"; return; } const filtrados = colaboradores.filter(c => c.matricula.toLowerCase().includes(val) || c.nome.toLowerCase().includes(val)); if (filtrados.length > 0) { lista.innerHTML = filtrados.map(c => `<div class="autocomplete-item" onclick="selecionarColabSolic('${c.matricula}','${c.nome.replace(/'/g, "\\'")}','${c.funcao || ''}','${c.secao || ''}')"><strong>${c.matricula}</strong> - ${c.nome}</div>`).join(""); lista.style.display = "block"; lista.style.width = this.offsetWidth + "px"; } else { lista.style.display = "none"; } });
function selecionarColabSolic(mat, nome, funcao, secao) { document.getElementById("matriculaSolic").value = mat; colaboradorSolicSelecionado = { matricula: mat, nome: nome, funcao: funcao, secao: secao }; document.getElementById("autocompleteListSolic").style.display = "none"; document.getElementById("infoNomeSolic").textContent = nome; document.getElementById("infoFuncaoSolic").textContent = funcao || "---"; document.getElementById("infoSecaoSolic").textContent = secao || "---"; document.getElementById("infoColabSolic").style.display = "block"; mostrarFeedback(`✅ Colaborador ${nome} selecionado!`, "success"); }
function adicionarItemSolicitacao() { const cod = document.getElementById("epiSelectSolic").value; const laudo = document.getElementById("laudoItem").value.trim(); if (!colaboradorSolicSelecionado) { mostrarFeedback("⚠️ Selecione um colaborador!", "error"); return; } if (!cod) { mostrarFeedback("⚠️ Selecione um EPI!", "error"); return; } const est = estoque[cod]; if (!est) { mostrarFeedback("EPI não encontrado!", "error"); return; } const existente = solicitacoesItens.find(i => i.codigo === cod); if (existente) existente.quantidade++; else solicitacoesItens.push({ codigo: cod, descricao: est.descricao, quantidade: 1, laudo: laudo || "Sem observação" }); document.getElementById("laudoItem").value = ""; atualizarListaSolicitacoesItens(); mostrarFeedback(`✅ ${est.descricao} adicionado!`, "success"); }
function atualizarListaSolicitacoesItens() { const div = document.getElementById("solicitacoesLista"); const span = document.getElementById("totalSolicitacoes"); if (!div) return; if (solicitacoesItens.length === 0) { div.innerHTML = '<div class="empty-state"><i class="fas fa-inbox"></i> Nenhum item</div>'; if (span) span.textContent = "0"; return; } span.textContent = solicitacoesItens.reduce((s,i) => s + i.quantidade, 0); div.innerHTML = solicitacoesItens.map((item, idx) => `<div class="carrinho-item"><div><strong>${item.descricao}</strong><br>Qtd: ${item.quantidade}<br><small><i class="fas fa-comment"></i> Laudo: ${item.laudo}</small></div><button class="btn-remover-carrinho" onclick="removerItemSolicitacao(${idx})"><i class="fas fa-trash"></i> Remover</button></div>`).join(""); }
function removerItemSolicitacao(idx) { solicitacoesItens.splice(idx, 1); atualizarListaSolicitacoesItens(); mostrarFeedback("Item removido!", "success"); }
function cancelarSolicitacao() { if (solicitacoesItens.length > 0 && confirm("Limpar solicitação?")) { solicitacoesItens = []; atualizarListaSolicitacoesItens(); mostrarFeedback("Solicitação limpa!", "success"); } else if (solicitacoesItens.length === 0) { document.getElementById("matriculaSolic").value = ""; colaboradorSolicSelecionado = null; document.getElementById("infoColabSolic").style.display = "none"; mostrarFeedback("Campos limpos!", "info"); } }
function enviarSolicitacao() { if (!colaboradorSolicSelecionado) { mostrarFeedback("⚠️ Selecione um colaborador!", "error"); return; } if (solicitacoesItens.length === 0) { mostrarFeedback("⚠️ Adicione itens!", "error"); return; } const nova = { id: Date.now(), matricula: colaboradorSolicSelecionado.matricula, nomeColab: colaboradorSolicSelecionado.nome, funcao: colaboradorSolicSelecionado.funcao, secao: colaboradorSolicSelecionado.secao, itens: [...solicitacoesItens], data: obterDataHora(), status: "pendente" }; solicitacoes.unshift(nova); salvarSolicitacoes(); solicitacoesItens = []; atualizarListaSolicitacoesItens(); document.getElementById("matriculaSolic").value = ""; colaboradorSolicSelecionado = null; document.getElementById("infoColabSolic").style.display = "none"; mostrarFeedback(`✅ Solicitação enviada!`, "success"); }
function aprovarSolicitacao(id) { const s = solicitacoes.find(s => s.id === id); if (!s) return; for (const item of s.itens) { const est = estoque[item.codigo]; if (!est || est.quantidade < item.quantidade) { mostrarFeedback(`⚠️ Estoque insuficiente para ${item.descricao}!`, "error"); return; } } const dh = obterDataHora(); const d = obterData(); for (const item of s.itens) { const est = estoque[item.codigo]; est.quantidade -= item.quantidade; est.emUso = (est.emUso || 0) + item.quantidade; est.ultimaMov = dh; movimentacoes.unshift({ id: Date.now(), tipo: "saida", matricula: s.matricula, nomeColab: s.nomeColab, codigoEPI: item.codigo, descricaoEPI: item.descricao, quantidade: item.quantidade, dataHora: dh, data: d, devolvido: false }); } s.status = "aprovada"; salvarSolicitacoes(); salvarDados(); renderizarEstoque(); preencherSelect(); preencherSelectSolicitacoes(); renderizarHistorico(""); mostrarFeedback(`✅ Solicitação aprovada!`, "success"); }
document.getElementById("buscaSolicitacoes")?.addEventListener("input", e => renderizarListaSolicitacoes(e.target.value));
document.getElementById("btnLimparBuscaSolic")?.addEventListener("click", () => { document.getElementById("buscaSolicitacoes").value = ""; renderizarListaSolicitacoes(""); });

// ============ RELATÓRIOS PDF ============
function relatorioDiario() { const data = document.getElementById("dataDiaria").value; if (!data) { mostrarFeedback("Selecione uma data!", "error"); return; } const [ano, mes, dia] = data.split('-'); const dataFmt = `${dia}/${mes}/${ano}`; const movs = movimentacoes.filter(m => m.data === dataFmt); let tabela = ''; for (const m of movs) tabela += `<tr><td style="padding:6px">${m.dataHora}</td><td style="padding:6px">${m.matricula}</td><td style="padding:6px">${m.nomeColab}</td><td style="padding:6px">${m.descricaoEPI}</td><td style="padding:6px">${m.quantidade}</td></tr>`; if (movs.length === 0) tabela = '<tr><td colspan="5" style="text-align:center;padding:6px">Nenhuma movimentação encontrada<th>'; const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Relatório Diário - ${dataFmt}</title><style>body{font-family:Arial;margin:15px}.logo{text-align:center;margin-bottom:10px}.logo img{height:40px}h1{color:#c41e3a}table{width:100%;border-collapse:collapse}th,td{border:1px solid #ccc;padding:8px;text-align:left}th{background:#c41e3a;color:#fff}</style></head><body><div class="logo"><img src="data:image/x-icon;base64,${LOGO_BASE64}" alt="WFS"></div><h1>Relatório Diário - ${dataFmt}</h1><p>Total: ${movs.length} movimentações</p><table border="1"><thead><tr><th>Data/Hora</th><th>Matrícula</th><th>Colaborador</th><th>EPI</th><th>Qtd</th></tr></thead><tbody>${tabela}</tbody></table></body></html>`; gerarPDF(html, `relatorio_${data}.pdf`); }
function relatorioMensal() { const ma = document.getElementById("dataMensal").value; if (!ma) { mostrarFeedback("Selecione um mês!", "error"); return; } const [ano, mes] = ma.split('-'); const movs = movimentacoes.filter(m => { const [d, m2, a] = m.data.split('/'); return m2 === mes && a === ano; }); let tabela = ''; for (const m of movs) tabela += `<tr><td style="padding:6px">${m.dataHora}</td><td style="padding:6px">${m.matricula}</td><td style="padding:6px">${m.nomeColab}</td><td style="padding:6px">${m.descricaoEPI}</td><td style="padding:6px">${m.quantidade}</td></tr>`; if (movs.length === 0) tabela = '<tr><td colspan="5" style="text-align:center;padding:6px">Nenhuma movimentação encontrada<th>'; const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Relatório Mensal - ${mes}/${ano}</title><style>body{font-family:Arial;margin:15px}.logo{text-align:center;margin-bottom:10px}.logo img{height:40px}h1{color:#c41e3a}table{width:100%;border-collapse:collapse}th,td{border:1px solid #ccc;padding:8px;text-align:left}th{background:#c41e3a;color:#fff}</style></head><body><div class="logo"><img src="data:image/x-icon;base64,${LOGO_BASE64}" alt="WFS"></div><h1>Relatório Mensal - ${mes}/${ano}</h1><p>Total: ${movs.length} movimentações</p><table border="1"><thead><tr><th>Data/Hora</th><th>Matrícula</th><th>Colaborador</th><th>EPI</th><th>Qtd</th></tr></thead><tbody>${tabela}</tbody></table></body></html>`; gerarPDF(html, `relatorio_${ma}.pdf`); }
function relatorioAnual() { const ano = document.getElementById("dataAnual").value; if (!ano) { mostrarFeedback("Digite o ano!", "error"); return; } const movs = movimentacoes.filter(m => { const [d, m2, a] = m.data.split('/'); return a === ano; }); let tabela = ''; for (const m of movs) tabela += `<tr><td style="padding:6px">${m.dataHora}</td><td style="padding:6px">${m.matricula}</td><td style="padding:6px">${m.nomeColab}</td><td style="padding:6px">${m.descricaoEPI}</td><td style="padding:6px">${m.quantidade}</td></tr>`; if (movs.length === 0) tabela = '<tr><td colspan="5" style="text-align:center;padding:6px">Nenhuma movimentação encontrada<th>'; const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Relatório Anual - ${ano}</title><style>body{font-family:Arial;margin:15px}.logo{text-align:center;margin-bottom:10px}.logo img{height:40px}h1{color:#c41e3a}table{width:100%;border-collapse:collapse}th,td{border:1px solid #ccc;padding:8px;text-align:left}th{background:#c41e3a;color:#fff}</style></head><body><div class="logo"><img src="data:image/x-icon;base64,${LOGO_BASE64}" alt="WFS"></div><h1>Relatório Anual - ${ano}</h1><p>Total: ${movs.length} movimentações</p><table border="1"><thead><tr><th>Data/Hora</th><th>Matrícula</th><th>Colaborador</th><th>EPI</th><th>Qtd</th></tr></thead><tbody>${tabela}</tbody></table></body></html>`; gerarPDF(html, `relatorio_${ano}.pdf`); }
function relatorioColaborador() { const busca = document.getElementById("buscaRelatorio").value; if (!busca) { mostrarFeedback("Digite a matrícula!", "error"); return; } const colab = colaboradores.find(c => c.matricula === busca); if (!colab) { mostrarFeedback("Colaborador não encontrado!", "error"); return; } const movs = movimentacoes.filter(m => m.matricula === busca); let tabela = ''; for (const m of movs) tabela += `<tr><td style="padding:4px">${m.dataHora}</td><td style="padding:4px">${m.descricaoEPI}</td><td style="padding:4px">${m.quantidade}</td></tr>`; if (movs.length === 0) tabela = '<tr><td colspan="3" style="text-align:center;padding:4px">Nenhum EPI retirado<th>'; const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Histórico do Colaborador - ${colab.nome}</title><style>*{margin:0;padding:0;box-sizing:border-box}@page{size:A4;margin:1.5cm}body{font-family:'Times New Roman',Arial;font-size:10pt;line-height:1.3}.logo{text-align:center;margin-bottom:10px}.logo img{height:40px}h1{font-size:16pt;color:#c41e3a;text-align:center;margin-bottom:10px}h2{font-size:14pt;text-align:center;border-bottom:2px solid #c41e3a;padding-bottom:5px;margin-bottom:15px}.info-box{background:#f5f5f5;padding:10px;margin:10px 0;border:1px solid #ddd;border-radius:5px}.info-box p{margin:3px 0}table{width:100%;border-collapse:collapse;margin:10px 0}th{background:#c41e3a;color:white;padding:6px;font-weight:bold}td{border:1px solid #999;padding:5px}.footer{font-size:8pt;text-align:center;margin-top:20px;border-top:1px solid #ccc;padding-top:8px;color:#666}</style></head><body><div class="logo"><img src="data:image/x-icon;base64,${LOGO_BASE64}" alt="WFS"></div><h1>EPI Control WFS</h1><h2>HISTÓRICO DE MOVIMENTAÇÕES</h2><div class="info-box"><p><strong>📌 DADOS DO COLABORADOR</strong></p><p><strong>Matrícula:</strong> ${colab.matricula} | <strong>Nome:</strong> ${colab.nome}</p><p><strong>Seção:</strong> ${colab.secao || '---'} | <strong>Função:</strong> ${colab.funcao || '---'}</p><p><strong>Data Admissão:</strong> ${colab.dataAdmissao || '---'} | <strong>Total de Retiradas:</strong> ${movs.length}</p></div><h3>📋 REGISTRO DE RETIRADAS</h3><table border="1"><thead><tr><th style="width:140px">Data/Hora da Retirada</th><th>EPI - Descrição</th><th style="width:80px">Quantidade</th></tr></thead><tbody>${tabela}</tbody></table><div class="footer">Documento gerado eletronicamente pelo sistema EPI Control WFS em ${new Date().toLocaleString()}</div></body></html>`; gerarPDF(html, `historico_${colab.matricula}.pdf`); mostrarFeedback("📄 Histórico PDF gerado!", "success"); }
function relatorioEstoque() { const epis = Object.values(estoque).sort((a,b) => a.descricao.localeCompare(b.descricao)); let tabela = ''; for (const e of epis) { const status = e.quantidade > 0 ? (e.quantidade <= 5 ? 'Alerta - Estoque Baixo' : 'Disponível') : 'Esgotado'; tabela += `<tr><td style="padding:6px"><strong>${e.codigo}</strong></td><td style="padding:6px">${e.descricao}</td><td style="padding:6px">${e.quantidade} unidades</td><td style="padding:6px">${e.emUso} em uso</td><td style="padding:6px">${status}</td></tr>`; } const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Relatório Estoque</title><style>body{font-family:Arial;margin:15px}.logo{text-align:center;margin-bottom:10px}.logo img{height:40px}h1{color:#c41e3a}table{width:100%;border-collapse:collapse}th,td{border:1px solid #ccc;padding:8px;text-align:left}th{background:#c41e3a;color:#fff}</style></head><body><div class="logo"><img src="data:image/x-icon;base64,${LOGO_BASE64}" alt="WFS"></div><h1>Relatório de Estoque</h1><p>Gerado em: ${new Date().toLocaleString()}</p><table border="1"><thead><tr><th>Código</th><th>Descrição</th><th>Quantidade</th><th>Em Uso</th><th>Status</th></tr></thead><tbody>${tabela}</tbody></table></body></html>`; gerarPDF(html, `relatorio_estoque.pdf`); }

// ============ EVENTOS PRINCIPAIS ============
document.getElementById("btnCadastrar")?.addEventListener("click", cadastrarColaborador);
document.getElementById("btnFinalizar")?.addEventListener("click", finalizarRequerimento);
document.getElementById("btnFinalizarSolic")?.addEventListener("click", enviarSolicitacao);
document.getElementById("btnRefresh")?.addEventListener("click", () => { renderizarEstoque(); mostrarFeedback("Atualizado!", "success"); });
document.getElementById("buscaColab")?.addEventListener("input", e => renderizarColaboradores(e.target.value));
document.getElementById("btnLimparBusca")?.addEventListener("click", () => { document.getElementById("buscaColab").value = ""; renderizarColaboradores(""); });
document.getElementById("buscaHistorico")?.addEventListener("input", e => renderizarHistorico(e.target.value));
document.getElementById("btnLimparHistorico")?.addEventListener("click", () => { document.getElementById("buscaHistorico").value = ""; renderizarHistorico(""); });
document.getElementById("btnSelecionarArquivo")?.addEventListener("click", () => document.getElementById("fileInput").click());

// ============ INICIALIZAÇÃO ============
verificarSessao();
initTheme();
createParticles();