/* Presentation-only keyboard and naming improvements. These checks do not
 * establish complete WCAG conformance or assistive-technology acceptance. */
(()=>{'use strict';
const W=window,D=document,MODALS='#v12Modal,#ygoRulingModal';
let installed=false,scheduled=false,activeModal=null,returnFocus=null,lastOutsideFocus=null;
const backgroundInert=new Map(),boundModals=new WeakSet();
const visible=element=>element instanceof HTMLElement&&!element.hidden
 &&!element.closest('[inert]')&&element.getClientRects().length>0;
function focusable(modal){return[...modal.querySelectorAll('button,a[href],input,select,textarea,[tabindex]')]
 .filter(element=>!element.disabled&&element.tabIndex>=0&&visible(element));}
function setAttribute(element,key,value){if(element&&element.getAttribute(key)!==value)element.setAttribute(key,value);}
function containBackground(modal){
 for(let ancestor=modal;ancestor&&ancestor!==D.body;ancestor=ancestor.parentElement){
  for(const sibling of ancestor.parentElement?.children||[]){
   if(sibling===ancestor||['SCRIPT','STYLE','LINK'].includes(sibling.tagName))continue;
   if(!backgroundInert.has(sibling))backgroundInert.set(sibling,sibling.inert);
   sibling.inert=true;
  }
 }
}
function restoreBackground(){for(const[element,value]of backgroundInert)element.inert=value;backgroundInert.clear();}
function closeModal(modal=activeModal){if(modal){modal.classList.remove('open');syncModals();}}
function firstFocus(modal){(focusable(modal)[0]||modal).focus({preventScroll:true});}
function enhanceModal(modal){
 setAttribute(modal,'role','dialog');setAttribute(modal,'aria-modal','true');
 if(!modal.hasAttribute('tabindex'))modal.tabIndex=-1;
 if(!modal.getAttribute('aria-labelledby')&&!modal.getAttribute('aria-label'))setAttribute(modal,'aria-label','Simulador de cartas');
 if(boundModals.has(modal))return;boundModals.add(modal);
 const close=modal.querySelector('.close,.ygo-ruling-close');
 if(close){setAttribute(close,'aria-label',modal.id==='v12Modal'?'Cerrar vista ampliada de la carta':'Cerrar simulador de cartas');
  close.addEventListener('click',()=>closeModal(modal));}
 modal.addEventListener('click',event=>{if(event.target===modal)closeModal(modal);});
}
function syncModals(){
 const modals=[...D.querySelectorAll(MODALS)];
 for(const modal of modals){enhanceModal(modal);const open=modal.classList.contains('open');
  setAttribute(modal,'aria-hidden',String(!open));modal.inert=!open;}
 const next=modals.find(modal=>modal.classList.contains('open'))||null;
 if(next===activeModal){if(next)containBackground(next);return;}
 const previous=activeModal;
 restoreBackground();activeModal=next;
 if(next){if(!previous)returnFocus=lastOutsideFocus||D.activeElement;
  containBackground(next);firstFocus(next);
 }else if(previous){const target=returnFocus;returnFocus=null;
  if(target?.isConnected&&visible(target)&&typeof target.focus==='function')target.focus({preventScroll:true});}
}
function pressed(selector){for(const button of D.querySelectorAll(selector))setAttribute(button,'aria-pressed',String(button.classList.contains('active')));}
function syncSelections(){
 pressed('.formats .fmt');pressed('.deck-tabs .deck-tab');pressed('.lab-tabs .lab-tab');
 for(const button of D.querySelectorAll('.deck-tabs .deck-tab'))setAttribute(button,'aria-controls','deckList');
 for(const[index,button]of [...D.querySelectorAll('.lab-tabs .lab-tab')].entries()){
  const target=['lab-db','lab-ban'][index];if(target&&D.getElementById(target))setAttribute(button,'aria-controls',target);}
}
function sync(){scheduled=false;syncSelections();syncModals();}
function schedule(){if(!scheduled){scheduled=true;W.requestAnimationFrame(sync);}}
function keydown(event){
 if(!activeModal)return;
 if(event.key==='Escape'){event.preventDefault();event.stopPropagation();closeModal();return;}
 if(event.key!=='Tab')return;
 const items=focusable(activeModal),first=items[0],last=items.at(-1),current=D.activeElement;
 if(!first){event.preventDefault();activeModal.focus({preventScroll:true});return;}
 if(!activeModal.contains(current)||event.shiftKey&&(current===first||current===activeModal)){
  event.preventDefault();(event.shiftKey?last:first).focus({preventScroll:true});
 }else if(!event.shiftKey&&current===last){event.preventDefault();first.focus({preventScroll:true});}
}
function install(){
 if(installed)return;installed=true;
 D.addEventListener('keydown',keydown,true);
 D.addEventListener('focusin',event=>{if(activeModal&&!activeModal.contains(event.target))firstFocus(activeModal);
  else if(!activeModal&&!event.target.closest?.(MODALS))lastOutsideFocus=event.target;},true);
 D.addEventListener('click',event=>{
  const link=event.target.closest?.('.ygo-skip-links a[href^="#"]');
  if(link){const target=D.getElementById(link.hash.slice(1));if(target){event.preventDefault();target.focus();target.scrollIntoView({block:'start',behavior:'instant'});}}
  if(event.target.closest?.('.fmt,.deck-tab,.lab-tab'))schedule();
 });
 for(const id of ['archBuilderStatus','alpha854OpponentStatus']){const element=D.getElementById(id);
  setAttribute(element,'role','status');setAttribute(element,'aria-live','polite');}
 for(const header of D.querySelectorAll('#ygoFormatEditor th'))setAttribute(header,'scope','col');
 new MutationObserver(schedule).observe(D.body,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});
 sync();
}
W.YGOAccessibility=Object.freeze({version:'keyboard-presentation-v1',
 scope:'REGISTERED_KEYBOARD_AND_NAMING_IMPROVEMENTS',completeAccessibilityCertified:false,
 assistiveTechnologyTested:false,physicalDevicesTested:false});
if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();
