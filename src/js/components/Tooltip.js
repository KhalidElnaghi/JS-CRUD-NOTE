"use strict";

/**
 * @param {HTMLElement} element - thw DOM to which the tolltip behavior is added
 */

export const Tooltip = function (element) {
  const tooltip = document.createElement("span");
  tooltip.classList.add("tooltip", "text-body-small");
  element.addEventListener("mouseenter", function () {
    tooltip.textContent = this.dataset.tooltip;
    const { top, height, left, width } = this.getBoundingClientRect();
    tooltip.style.top = top + height + 4 + "px";
    tooltip.style.left = left + width / 2 + "px";
    tooltip.style.transform = "translate(-50%, 0)";
    document.body.appendChild(tooltip);
  });
  element.addEventListener("mouseleave", tooltip.remove.bind(tooltip));
};
