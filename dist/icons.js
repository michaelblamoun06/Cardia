(() => {
const paths = {
 cube:'<path d="m12 2 8.5 5v10L12 22l-8.5-5V7z"/><path d="m3.5 7 8.5 5 8.5-5M12 12v10M8 4.5l8.5 5"/>',
 library:'<rect x="3" y="4" width="4" height="16" rx=".7"/><path d="M10 4v16m2.5-15.5 4-1 4.3 15.6-4 1z"/>',cap:'<path d="m2 9 10-5 10 5-10 5zM6 11v5c4 3 8 3 12 0v-5m4-2v7"/>',
 help:'<circle cx="12" cy="12" r="9"/><path d="M9.6 9a2.5 2.5 0 0 1 5-.2c0 2-2.6 2.4-2.6 4m0 3h.01"/>',
 bookmark:'<path d="M6 4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v17l-6-4-6 4z"/>',
 grid:'<rect x="3" y="3" width="7" height="7" rx="1.3"/><rect x="14" y="3" width="7" height="7" rx="1.3"/><rect x="3" y="14" width="7" height="7" rx="1.3"/><rect x="14" y="14" width="7" height="7" rx="1.3"/>',
 chevron:'<path d="m9 6 6 6-6 6"/>',down:'<path d="m6 9 6 6 6-6"/>',
 layers:'<path d="m2 8 10-5 10 5-10 5zM3 12l9 5 9-5M3 16l9 5 9-5"/>',
 expand:'<path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/>',
 orientation:'<path d="m12 2 8 17-8-4-8 4z"/>',tag:'<path d="m3 3 9 .2 9 9-8.7 8.7-9-9z"/><circle cx="7.5" cy="7.5" r=".8"/>',
 orbit:'<ellipse cx="12" cy="12" rx="10" ry="5" transform="rotate(-34 12 12)"/><circle cx="12" cy="12" r="2"/><path d="M4.3 5.7 4 9l3-1"/>',
 hand:'<path d="M8 12V6a1.5 1.5 0 0 1 3 0v5-7a1.5 1.5 0 0 1 3 0v7-5a1.4 1.4 0 0 1 2.8 0v6-3a1.5 1.5 0 0 1 3 0v6c0 4-2.5 6-6 6h-2c-2.5 0-4-1.5-5-3l-3.3-5a1.5 1.5 0 0 1 2.4-1.8L8 14z"/>',
 zoomin:'<circle cx="10.5" cy="10.5" r="6.8"/><path d="m16 16 5 5M7.5 10.5h6m-3-3v6"/>',zoomout:'<circle cx="10.5" cy="10.5" r="6.8"/><path d="m16 16 5 5M7.5 10.5h6"/>',
 reset:'<path d="M3 10a9 9 0 1 1 1.4 8M3 4v6h6"/>',mouse:'<rect x="6" y="2" width="12" height="20" rx="6"/><path d="M12 5v5"/>',
 info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10h.01"/>',book:'<path d="M12 6c-3-2-7-2-10-1v14c3-1 7-1 10 1 3-2 7-2 10-1V5c-3-1-7-1-10 1zM12 6v14"/>',
 x:'<path d="m6 6 12 12m0-12L6 18"/>',search:'<circle cx="10.5" cy="10.5" r="6.8"/><path d="m16 16 5 5"/>',check:'<path d="m4 12 5 5 11-11"/>',clock:'<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>',
 flow:'<circle cx="5" cy="5" r="2"/><circle cx="19" cy="19" r="2"/><path d="M7 5h8a4 4 0 0 1 0 8H9a3 3 0 0 0 0 6h8"/>',
 pin:'<path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0z"/><circle cx="12" cy="10" r="2"/>',
 heart:'<path d="M20 5c-4-3-8 2-8 2S8 2 4 5C-2 10 8 18 12 21c4-3 14-11 8-16z"/>',
 target:'<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r=".5"/>',
 play:'<path d="m8 4 12 8-12 8z"/>',menu:'<path d="M3 5h18M3 12h18M3 19h18"/>',back:'<path d="m15 6-6 6 6 6"/>',external:'<path d="M13 4h7v7m0-7L10 14m-1-9H4v15h15v-5"/>'
};
window.icon=(n)=>'<svg class="icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(paths[n]||'')+'</svg>';
document.querySelectorAll('i[data-icon]').forEach(i=>i.outerHTML=icon(i.dataset.icon));
})();
