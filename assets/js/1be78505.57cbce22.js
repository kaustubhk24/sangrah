"use strict";(self.webpackChunkaarati_sangrah=self.webpackChunkaarati_sangrah||[]).push([[9514,4972],{9963:(e,t,n)=>{n.r(t),n.d(t,{default:()=>pe});var a=n(7294),o=n(6010),l=n(1944),r=n(5281),i=n(3320),c=n(2802),s=n(4477),d=n(1116),m=n(7676),u=n(5999),b=n(2466),p=n(5936);const h={backToTopButton:"backToTopButton_sjWU",backToTopButtonShow:"backToTopButtonShow_xfvO"};function E(){const{shown:e,scrollToTop:t}=function(e){let{threshold:t}=e;const[n,o]=(0,a.useState)(!1),l=(0,a.useRef)(!1),{startScroll:r,cancelScroll:i}=(0,b.Ct)();return(0,b.RF)(((e,n)=>{let{scrollY:a}=e;const r=n?.scrollY;r&&(l.current?l.current=!1:a>=r?(i(),o(!1)):a<t?o(!1):a+window.innerHeight<document.documentElement.scrollHeight&&o(!0))})),(0,p.S)((e=>{e.location.hash&&(l.current=!0,o(!1))})),{shown:n,scrollToTop:()=>r(0)}}({threshold:300});return a.createElement("button",{"aria-label":(0,u.I)({id:"theme.BackToTopButton.buttonAriaLabel",message:"Scroll back to top",description:"The ARIA label for the back to top button"}),className:(0,o.Z)("clean-btn",r.k.common.backToTopButton,h.backToTopButton,e&&h.backToTopButtonShow),type:"button",onClick:t})}var f=n(6550),g=n(7524),v=n(6668),k=n(1327),_=n(7462);function C(e){return a.createElement("svg",(0,_.Z)({width:"20",height:"20","aria-hidden":"true"},e),a.createElement("g",{fill:"#7a7a7a"},a.createElement("path",{d:"M9.992 10.023c0 .2-.062.399-.172.547l-4.996 7.492a.982.982 0 01-.828.454H1c-.55 0-1-.453-1-1 0-.2.059-.403.168-.551l4.629-6.942L.168 3.078A.939.939 0 010 2.528c0-.548.45-.997 1-.997h2.996c.352 0 .649.18.828.45L9.82 9.472c.11.148.172.347.172.55zm0 0"}),a.createElement("path",{d:"M19.98 10.023c0 .2-.058.399-.168.547l-4.996 7.492a.987.987 0 01-.828.454h-3c-.547 0-.996-.453-.996-1 0-.2.059-.403.168-.551l4.625-6.942-4.625-6.945a.939.939 0 01-.168-.55 1 1 0 01.996-.997h3c.348 0 .649.18.828.45l4.996 7.492c.11.148.168.347.168.55zm0 0"})))}const S={collapseSidebarButton:"collapseSidebarButton_PEFL",collapseSidebarButtonIcon:"collapseSidebarButtonIcon_kv0_"};function I(e){let{onClick:t}=e;return a.createElement("button",{type:"button",title:(0,u.I)({id:"theme.docs.sidebar.collapseButtonTitle",message:"Collapse sidebar",description:"The title attribute for collapse button of doc sidebar"}),"aria-label":(0,u.I)({id:"theme.docs.sidebar.collapseButtonAriaLabel",message:"Collapse sidebar",description:"The title attribute for collapse button of doc sidebar"}),className:(0,o.Z)("button button--secondary button--outline",S.collapseSidebarButton),onClick:t},a.createElement(C,{className:S.collapseSidebarButtonIcon}))}var N=n(9689),T=n(902);const x=Symbol("EmptyContext"),Z=a.createContext(x);function B(e){let{children:t}=e;const[n,o]=(0,a.useState)(null),l=(0,a.useMemo)((()=>({expandedItem:n,setExpandedItem:o})),[n]);return a.createElement(Z.Provider,{value:l},t)}var y=n(6043),w=n(8596),L=n(9960),A=n(2389);function H(e){let{categoryLabel:t,onClick:n}=e;return a.createElement("button",{"aria-label":(0,u.I)({id:"theme.DocSidebarItem.toggleCollapsedCategoryAriaLabel",message:"Toggle the collapsible sidebar category '{label}'",description:"The ARIA label to toggle the collapsible sidebar category"},{label:t}),type:"button",className:"clean-btn menu__caret",onClick:n})}function M(e){let{item:t,onItemClick:n,activePath:l,level:i,index:s,...d}=e;const{items:m,label:u,collapsible:b,className:p,href:h}=t,{docs:{sidebar:{autoCollapseCategories:E}}}=(0,v.L)(),f=function(e){const t=(0,A.Z)();return(0,a.useMemo)((()=>e.href?e.href:!t&&e.collapsible?(0,c.Wl)(e):void 0),[e,t])}(t),g=(0,c._F)(t,l),k=(0,w.Mg)(h,l),{collapsed:C,setCollapsed:S}=(0,y.u)({initialState:()=>!!b&&(!g&&t.collapsed)}),{expandedItem:I,setExpandedItem:N}=function(){const e=(0,a.useContext)(Z);if(e===x)throw new T.i6("DocSidebarItemsExpandedStateProvider");return e}(),B=function(e){void 0===e&&(e=!C),N(e?null:s),S(e)};return function(e){let{isActive:t,collapsed:n,updateCollapsed:o}=e;const l=(0,T.D9)(t);(0,a.useEffect)((()=>{t&&!l&&n&&o(!1)}),[t,l,n,o])}({isActive:g,collapsed:C,updateCollapsed:B}),(0,a.useEffect)((()=>{b&&null!=I&&I!==s&&E&&S(!0)}),[b,I,s,S,E]),a.createElement("li",{className:(0,o.Z)(r.k.docs.docSidebarItemCategory,r.k.docs.docSidebarItemCategoryLevel(i),"menu__list-item",{"menu__list-item--collapsed":C},p)},a.createElement("div",{className:(0,o.Z)("menu__list-item-collapsible",{"menu__list-item-collapsible--active":k})},a.createElement(L.Z,(0,_.Z)({className:(0,o.Z)("menu__link",{"menu__link--sublist":b,"menu__link--sublist-caret":!h&&b,"menu__link--active":g}),onClick:b?e=>{n?.(t),h?B(!1):(e.preventDefault(),B())}:()=>{n?.(t)},"aria-current":k?"page":void 0,"aria-expanded":b?!C:void 0,href:b?f??"#":f},d),u),h&&b&&a.createElement(H,{categoryLabel:u,onClick:e=>{e.preventDefault(),B()}})),a.createElement(y.z,{lazy:!0,as:"ul",className:"menu__list",collapsed:C},a.createElement(K,{items:m,tabIndex:C?-1:0,onItemClick:n,activePath:l,level:i+1})))}var F=n(3919),P=n(9471);const W={menuExternalLink:"menuExternalLink_NmtK"};function D(e){let{item:t,onItemClick:n,activePath:l,level:i,index:s,...d}=e;const{href:m,label:u,className:b,autoAddBaseUrl:p}=t,h=(0,c._F)(t,l),E=(0,F.Z)(m);return a.createElement("li",{className:(0,o.Z)(r.k.docs.docSidebarItemLink,r.k.docs.docSidebarItemLinkLevel(i),"menu__list-item",b),key:u},a.createElement(L.Z,(0,_.Z)({className:(0,o.Z)("menu__link",!E&&W.menuExternalLink,{"menu__link--active":h}),autoAddBaseUrl:p,"aria-current":h?"page":void 0,to:m},E&&{onClick:n?()=>n(t):void 0},d),u,!E&&a.createElement(P.Z,null)))}const R={menuHtmlItem:"menuHtmlItem_M9Kj"};function V(e){let{item:t,level:n,index:l}=e;const{value:i,defaultStyle:c,className:s}=t;return a.createElement("li",{className:(0,o.Z)(r.k.docs.docSidebarItemLink,r.k.docs.docSidebarItemLinkLevel(n),c&&[R.menuHtmlItem,"menu__list-item"],s),key:l,dangerouslySetInnerHTML:{__html:i}})}function z(e){let{item:t,...n}=e;switch(t.type){case"category":return a.createElement(M,(0,_.Z)({item:t},n));case"html":return a.createElement(V,(0,_.Z)({item:t},n));default:return a.createElement(D,(0,_.Z)({item:t},n))}}function U(e){let{items:t,...n}=e;return a.createElement(B,null,t.map(((e,t)=>a.createElement(z,(0,_.Z)({key:t,item:e,index:t},n)))))}const K=(0,a.memo)(U),j={menu:"menu_SIkG",menuWithAnnouncementBar:"menuWithAnnouncementBar_GW3s"};function q(e){let{path:t,sidebar:n,className:l}=e;const i=function(){const{isActive:e}=(0,N.nT)(),[t,n]=(0,a.useState)(e);return(0,b.RF)((t=>{let{scrollY:a}=t;e&&n(0===a)}),[e]),e&&t}();return a.createElement("nav",{"aria-label":(0,u.I)({id:"theme.docs.sidebar.navAriaLabel",message:"Docs sidebar",description:"The ARIA label for the sidebar navigation"}),className:(0,o.Z)("menu thin-scrollbar",j.menu,i&&j.menuWithAnnouncementBar,l)},a.createElement("ul",{className:(0,o.Z)(r.k.docs.docSidebarMenu,"menu__list")},a.createElement(K,{items:n,activePath:t,level:1})))}const G={sidebar:"sidebar_njMd",sidebarWithHideableNavbar:"sidebarWithHideableNavbar_wUlq",sidebarHidden:"sidebarHidden_VK0M",sidebarLogo:"sidebarLogo_isFc"};function Y(e){let{path:t,sidebar:n,onCollapse:l,isHidden:r}=e;const{navbar:{hideOnScroll:i},docs:{sidebar:{hideable:c}}}=(0,v.L)();return a.createElement("div",{className:(0,o.Z)(G.sidebar,i&&G.sidebarWithHideableNavbar,r&&G.sidebarHidden)},i&&a.createElement(k.Z,{tabIndex:-1,className:G.sidebarLogo}),a.createElement(q,{path:t,sidebar:n}),c&&a.createElement(I,{onClick:l}))}const O=a.memo(Y);var X=n(3102),J=n(2961);const Q=e=>{let{sidebar:t,path:n}=e;const l=(0,J.e)();return a.createElement("ul",{className:(0,o.Z)(r.k.docs.docSidebarMenu,"menu__list")},a.createElement(K,{items:t,activePath:n,onItemClick:e=>{"category"===e.type&&e.href&&l.toggle(),"link"===e.type&&l.toggle()},level:1}))};function $(e){return a.createElement(X.Zo,{component:Q,props:e})}const ee=a.memo($);function te(e){const t=(0,g.i)(),n="desktop"===t||"ssr"===t,o="mobile"===t;return a.createElement(a.Fragment,null,n&&a.createElement(O,e),o&&a.createElement(ee,e))}const ne={expandButton:"expandButton_m80_",expandButtonIcon:"expandButtonIcon_BlDH"};function ae(e){let{toggleSidebar:t}=e;return a.createElement("div",{className:ne.expandButton,title:(0,u.I)({id:"theme.docs.sidebar.expandButtonTitle",message:"Expand sidebar",description:"The ARIA label and title attribute for expand button of doc sidebar"}),"aria-label":(0,u.I)({id:"theme.docs.sidebar.expandButtonAriaLabel",message:"Expand sidebar",description:"The ARIA label and title attribute for expand button of doc sidebar"}),tabIndex:0,role:"button",onKeyDown:t,onClick:t},a.createElement(C,{className:ne.expandButtonIcon}))}const oe={docSidebarContainer:"docSidebarContainer_b6E3",docSidebarContainerHidden:"docSidebarContainerHidden_b3ry",sidebarViewport:"sidebarViewport_Xe31"};function le(e){let{children:t}=e;const n=(0,d.V)();return a.createElement(a.Fragment,{key:n?.name??"noSidebar"},t)}function re(e){let{sidebar:t,hiddenSidebarContainer:n,setHiddenSidebarContainer:l}=e;const{pathname:i}=(0,f.TH)(),[c,s]=(0,a.useState)(!1),d=(0,a.useCallback)((()=>{c&&s(!1),l((e=>!e))}),[l,c]);return a.createElement("aside",{className:(0,o.Z)(r.k.docs.docSidebarContainer,oe.docSidebarContainer,n&&oe.docSidebarContainerHidden),onTransitionEnd:e=>{e.currentTarget.classList.contains(oe.docSidebarContainer)&&n&&s(!0)}},a.createElement(le,null,a.createElement("div",{className:(0,o.Z)(oe.sidebarViewport,c&&oe.sidebarViewportHidden)},a.createElement(te,{sidebar:t,path:i,onCollapse:d,isHidden:c}),c&&a.createElement(ae,{toggleSidebar:d}))))}const ie={docMainContainer:"docMainContainer_gTbr",docMainContainerEnhanced:"docMainContainerEnhanced_Uz_u",docItemWrapperEnhanced:"docItemWrapperEnhanced_czyv"};function ce(e){let{hiddenSidebarContainer:t,children:n}=e;const l=(0,d.V)();return a.createElement("main",{className:(0,o.Z)(ie.docMainContainer,(t||!l)&&ie.docMainContainerEnhanced)},a.createElement("div",{className:(0,o.Z)("container padding-top--md padding-bottom--lg",ie.docItemWrapper,t&&ie.docItemWrapperEnhanced)},n))}const se={docPage:"docPage__5DB",docsWrapper:"docsWrapper_BCFX"};function de(e){let{children:t}=e;const n=(0,d.V)(),[o,l]=(0,a.useState)(!1);return a.createElement(m.Z,{wrapperClassName:se.docsWrapper},a.createElement(E,null),a.createElement("div",{className:se.docPage},n&&a.createElement(re,{sidebar:n.items,hiddenSidebarContainer:o,setHiddenSidebarContainer:l}),a.createElement(ce,{hiddenSidebarContainer:o},t)))}var me=n(4972),ue=n(197);function be(e){const{versionMetadata:t}=e;return a.createElement(a.Fragment,null,a.createElement(ue.Z,{version:t.version,tag:(0,i.os)(t.pluginId,t.version)}),a.createElement(l.d,null,t.noIndex&&a.createElement("meta",{name:"robots",content:"noindex, nofollow"})))}function pe(e){const{versionMetadata:t}=e,n=(0,c.hI)(e);if(!n)return a.createElement(me.default,null);const{docElement:i,sidebarName:m,sidebarItems:u}=n;return a.createElement(a.Fragment,null,a.createElement(be,e),a.createElement(l.FG,{className:(0,o.Z)(r.k.wrapper.docsPages,r.k.page.docsDocPage,e.versionMetadata.className)},a.createElement(s.q,{version:t},a.createElement(d.b,{name:m,items:u},a.createElement(de,null,i)))))}},4972:(e,t,n)=>{n.r(t),n.d(t,{default:()=>i});var a=n(7294),o=n(5999),l=n(1944),r=n(7676);function i(){return a.createElement(a.Fragment,null,a.createElement(l.d,{title:(0,o.I)({id:"theme.NotFound.title",message:"Page Not Found"})}),a.createElement(r.Z,null,a.createElement("main",{className:"container margin-vert--xl"},a.createElement("div",{className:"row"},a.createElement("div",{className:"col col--6 col--offset-3"},a.createElement("h1",{className:"hero__title"},a.createElement(o.Z,{id:"theme.NotFound.title",description:"The title of the 404 page"},"Page Not Found")),a.createElement("p",null,a.createElement(o.Z,{id:"theme.NotFound.p1",description:"The first paragraph of the 404 page"},"We could not find what you were looking for.")),a.createElement("p",null,a.createElement(o.Z,{id:"theme.NotFound.p2",description:"The 2nd paragraph of the 404 page"},"Please contact the owner of the site that linked you to the original URL and let them know their link is broken.")))))))}},4477:(e,t,n)=>{n.d(t,{E:()=>i,q:()=>r});var a=n(7294),o=n(902);const l=a.createContext(null);function r(e){let{children:t,version:n}=e;return a.createElement(l.Provider,{value:n},t)}function i(){const e=(0,a.useContext)(l);if(null===e)throw new o.i6("DocsVersionProvider");return e}}}]);