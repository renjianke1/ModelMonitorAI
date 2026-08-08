import { renderHome, bindHome } from './home.js';
import { renderModels, bindModels, renderCompare, bindCompare } from './models.js';
import { renderChat, bindChat } from './chat.js';
import { renderSpeed, bindSpeed } from './speed.js';
import { renderToken, bindToken } from './token.js';
import { renderDead, bindDead } from './dead-models.js';

const pages = { home:{label:'概览',icon:'⌂'}, models:{label:'模型',icon:'▦'}, chat:{label:'对话',icon:'▱'}, speed:{label:'测速',icon:'◷'}, token:{label:'Token',icon:'◒'}, dead:{label:'挂掉',icon:'⚠'} };
let currentPage = 'home';
const app = document.querySelector('#app');
const nav = document.querySelector('#bottom-nav');
const toast = document.querySelector('#toast');

function showToast(message){ toast.textContent=message; toast.classList.add('show'); clearTimeout(showToast.timer); showToast.timer=setTimeout(()=>toast.classList.remove('show'),1800); }
function navigate(page){ currentPage=page; render(); window.scrollTo({top:0,behavior:'smooth'}); }
function render(){ nav.innerHTML=Object.entries(pages).map(([key,p])=>`<button class="nav-item ${key===currentPage?'active':''}" data-page="${key}"><span class="nav-icon">${p.icon}</span><span>${p.label}</span></button>`).join(''); const common={onToast:showToast,navigate}; if(currentPage==='compare'){ app.innerHTML=renderCompare(); bindCompare(app,common); } else { const views={home:renderHome,models:renderModels,chat:renderChat,speed:renderSpeed,token:renderToken,dead:renderDead}; const bindings={home:bindHome,models:bindModels,chat:bindChat,speed:bindSpeed,token:bindToken,dead:bindDead}; app.innerHTML=views[currentPage](common); bindings[currentPage]?.(app,common); } nav.querySelectorAll('[data-page]').forEach(b=>b.addEventListener('click',()=>navigate(b.dataset.page))); }

render();
