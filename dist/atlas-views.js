(() => {
  'use strict';

  const styles = {
    category: ['#e86550','#668fcb','#78b7a2','#d89c8e'],
    contrast: ['#f3a547','#69bded','#77d7ac','#c698cf']
  };
  const categoryNames = ['Arteries','Veins','Airways','Tissue'];
  const categoryKeys = ['arteries','veins','airways','tissue'];
  const icon = '<svg width="17" height="17" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M2 5h7m4 0h5M2 10h2m4 0h10M2 15h10m4 0h2"/><circle cx="11" cy="5" r="2"/><circle cx="6" cy="10" r="2"/><circle cx="14" cy="15" r="2"/></svg>';

  window.bindCardiaViews = function bindCardiaViews(viewer, host, getScene) {
    if (!host || !viewer) return;
    const orientation = document.getElementById('orientation');
    if (orientation) {
      const options = new Set(Array.from(orientation.options, option => option.value));
      for (const name of ['Superior','Inferior']) {
        if (!options.has(name)) orientation.insertBefore(new Option(name,name),orientation.querySelector('option[hidden]'));
      }
    }
    host.innerHTML = '<details class="av-controls"><summary>'+icon+'<span>View controls</span><span class="av-caret" aria-hidden="true"></span></summary>'+
      '<div class="av-content">'+
      '<div class="av-row"><span id="av-depth-label">Anatomical view</span><div class="av-segment" role="group" aria-labelledby="av-depth-label"><button type="button" data-av-mode="surface">Surface</button><button type="button" data-av-mode="deep">Deep</button></div></div>'+
      '<p class="av-note" id="av-mode-note"></p>'+
      '<label class="av-slider"><span>Tissue opacity</span><output for="av-opacity"></output><input id="av-opacity" type="range" min="0" max="100" step="5" value="100"></label>'+
      '<label class="av-slider"><span>Structure spread</span><output for="av-spread"></output><input id="av-spread" type="range" min="0" max="100" step="5" value="0" aria-describedby="av-spread-note"></label>'+
      '<p class="av-note" id="av-spread-note" hidden>Spread separates structures from their anatomical positions.</p>'+
      '<label class="av-row"><span>Color palette</span><select id="av-palette"><option value="anatomical">Anatomical</option><option value="category">By structure type</option><option value="contrast">High contrast</option></select></label>'+
      '<div class="av-key" aria-label="Color key" hidden></div>'+
      '<div class="av-row"><span id="av-motion-label">Auto-rotate</span><button class="av-toggle" type="button" role="switch" aria-labelledby="av-motion-label" aria-checked="false" id="av-motion"><span aria-hidden="true"></span></button></div>'+
      '</div></details>';

    const find = key => host.querySelector(key);
    const opacity = find('#av-opacity'), spread = find('#av-spread'), palette = find('#av-palette');
    const surface = find('[data-av-mode="surface"]'), deep = find('[data-av-mode="deep"]');
    const motion = find('#av-motion'), key = find('.av-key'), note = find('#av-mode-note');
    const opacityText = find('output[for="av-opacity"]'), spreadText = find('output[for="av-spread"]');
    let previousScene;
    function refresh() {
      const scene = getScene?.();
      if (previousScene !== viewer.scene) {
        previousScene = viewer.scene;
        // These named veins lie in the superficial venous system of the limbs or neck.
        const superficial = (scene?.items || []).filter(item => item.layer === 'veins' &&
          /\b(great saphenous|small saphenous|cephalic vein|basilic vein|median cubital|external jugular)\b/i.test(item.name));
        viewer.superficialIds = new Set(superficial.map(item => item.id));
      }
      const parts = viewer.scene?.parts || [];
      const hasTissue = parts.some(part => part.layer === 'tissue');
      const hasShell = !!viewer.scene?.shells.size;
      const hasInner = !!viewer.scene?.internal.size;
      const hasVeins = !!viewer.superficialIds?.size;
      const canReveal = hasShell || hasInner || hasVeins || hasTissue;
      deep.disabled = !canReveal;
      surface.setAttribute('aria-pressed',String(!viewer.reveal));
      deep.setAttribute('aria-pressed',String(!!viewer.reveal));
      note.textContent = !canReveal ? 'This regional mesh contains vessels without a surface layer.' :
        hasShell ? 'Deep view removes outer organ walls or lung segments.' :
        hasVeins && !hasTissue ? 'Deep view hides the named superficial veins in this region.' :
        hasInner ? 'Deep view reveals internal structures through the outer tissue.' :
        'Deep view fades surrounding tissue to expose underlying structures.';
      opacity.disabled = !hasTissue;
      opacity.value = String(Math.round(viewer.opacity*100));
      opacityText.value = opacity.disabled ? 'No tissue mesh' : opacity.value+'%';
      spread.disabled = !!viewer.isolated;
      spread.value = String(Math.round(viewer.spread*100));
      spreadText.value = spread.disabled ? 'Isolated' : spread.value+'%';
      find('#av-spread-note').hidden = !(viewer.spread && !viewer.isolated);
      palette.value = viewer.palette;
      motion.setAttribute('aria-checked',String(!!viewer.autoRotate));
      const legacy = document.getElementById('reveal');
      if (legacy) legacy.setAttribute('aria-pressed',String(!!viewer.reveal));
      key.hidden = !styles[viewer.palette];
      const present = new Set(parts.map(part => part.layer));
      key.replaceChildren();
      if (!key.hidden) {
        categoryNames.forEach((label,index) => {
          if (!present.has(categoryKeys[index])) return;
          const swatch = document.createElement('span');
          swatch.style.setProperty('--av-color',styles[viewer.palette][index]);
          swatch.textContent = label;
          key.append(swatch);
        });
      }
      document.documentElement.dataset.anatomyPalette=viewer.palette;
    }
    host.addEventListener('input',event => {
      if (event.target === opacity) viewer.setTissueOpacity(Number(opacity.value)/100);
      else if (event.target === spread) viewer.setSpread(Number(spread.value)/100);
      else return;
      refresh();
    });
    palette.addEventListener('change',() => {viewer.setPalette(palette.value);refresh();});
    surface.addEventListener('click',() => {viewer.setDepthMode('surface');refresh();});
    deep.addEventListener('click',() => {viewer.setDepthMode('deep');refresh();});
    motion.addEventListener('click',() => {viewer.setAutoRotate(!viewer.autoRotate);refresh();});
    viewer.onDisplayChange = refresh;
    window.refreshCardiaViews = refresh;
    refresh();
  };
})();
