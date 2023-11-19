module.exports = async (page, scenario) => {
  const hoverSelector = scenario.hoverSelectors || scenario.hoverSelector;
  const clickSelector = scenario.clickSelectors || scenario.clickSelector;
  const activeSelector = scenario.activeSelectors || scenario.activeSelector;
  const disableSelector = scenario.disableSelectors || scenario.disableSelector;
  const focusSelector = scenario.focusSelectors || scenario.focusSelector;
  const keyPressSelector = scenario.keyPressSelectors || scenario.keyPressSelector;
  const scrollToSelector = scenario.scrollToSelector;
  const postInteractionWait = scenario.postInteractionWait; // ms [int]

  const interactiveElsSelector = "a, button, input[type='radio'], input[type='checkbox'], label";
  const content = `
      const preventer = (e) => e.preventDefault();
      const els = document.querySelectorAll("${interactiveElsSelector}");
      const mouseEvts = ["mouseup", "mousedown", "click"];

      els.forEach((el) => {
        mouseEvts.forEach((me) => el.addEventListener(me, preventer));
      });
    `;

  // await page.addScriptTag({ content });

  if (disableSelector) {
    await Promise.all(
      [].concat(disableSelector).map(async (selector) => {
        await page
          .evaluate((sel) => {
            document.querySelectorAll(sel).forEach(s => {
              if (s.tagName === 'LABEL') {
                s = s.control
              }
              s.disabled = true;
              s.classList.add('disabled');
            });
          }, selector);
      })
    );
  }

  if (keyPressSelector) {
    for (const keyPressSelectorItem of [].concat(keyPressSelector)) {
      await page.waitFor(keyPressSelectorItem.selector);
      await page.type(keyPressSelectorItem.selector, keyPressSelectorItem.keyPress);
    }
  }

  if (hoverSelector) {
    for (const hoverSelectorIndex of [].concat(hoverSelector)) {
      await page.waitForSelector(hoverSelectorIndex);
      await page.hover(hoverSelectorIndex);
    }
  }

  if (activeSelector) {
    for (const activeSelectorIndex of [].concat(activeSelector)) {
      await page.waitForSelector(activeSelectorIndex);
      await page.hover(activeSelectorIndex);
      await page.mouse.down();
    }
  }

  if (clickSelector) {
    for (const clickSelectorIndex of [].concat(clickSelector)) {
      await page.waitForSelector(clickSelectorIndex);
      await page.click(clickSelectorIndex);
    }
  }

  if (focusSelector) {
    for (const focusSelectorIndex of [].concat(focusSelector)) {
      await page.waitForSelector(focusSelectorIndex);
      await page.focus(focusSelectorIndex);
    }
  }

  if (postInteractionWait) {
    await page.waitForTimeout(postInteractionWait);
  }

  if (scrollToSelector) {
    await page.waitFor(scrollToSelector);
    await page.evaluate(scrollToSelector => {
      document.querySelector(scrollToSelector).scrollIntoView();
    }, scrollToSelector);
  }
};
