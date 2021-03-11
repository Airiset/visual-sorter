/**
 * This module ensures that browser-specific functionality is
 * included.
 */

requestAnimationFrame = window.requestAnimationFrame
    || window.mozRequestAnimationFrame
    || window.webkitRequestAnimationFrame
    || window.msRequestAnimationFrame

cancelAnimationFrame = window.cancelAnimationFrame
    || window.mozCancelAnimationFrame