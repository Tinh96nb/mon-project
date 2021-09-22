/*
 * @license
 *
 * Multiselect v2.5.6
 * http://crlcu.github.io/multiselect/
 *
 * Copyright (c) 2016-2020 Adrian Crisan
 * Licensed under the MIT license (https://github.com/crlcu/multiselect/blob/master/LICENSE)
 */

if("undefined"==typeof jQuery)throw new Error("multiselect requires jQuery");!function(){"use strict";var t=jQuery.fn.jquery.split(" ")[0].split(".");if(t[0]<2&&t[1]<7)throw new Error("multiselect requires jQuery version 1.7 or higher")}(),function(t){"function"==typeof define&&define.amd?define(["jquery"],t):t(jQuery)}(function(i){"use strict";var s,r=(s=i,t.prototype={init:function(){var o=this;o.undoStack=[],o.redoStack=[],o.options.keepRenderingSort&&(!(o.skipInitSort=!0)!==o.callbacks.sort&&(o.callbacks.sort={left:function(t,e){return s(t).data("position")>s(e).data("position")?1:-1},right:function(t,e){return s(t).data("position")>s(e).data("position")?1:-1}}),o.$left.attachIndex(),o.$right.each(function(t,e){s(e).attachIndex()})),"function"==typeof o.callbacks.startUp&&o.callbacks.startUp(o.$left,o.$right),o.skipInitSort||("function"==typeof o.callbacks.sort.left&&o.$left.mSort(o.callbacks.sort.left),"function"==typeof o.callbacks.sort.right&&o.$right.each(function(t,e){s(e).mSort(o.callbacks.sort.right)})),o.options.search&&o.options.search.left&&(o.options.search.$left=s(o.options.search.left),o.$left.before(o.options.search.$left)),o.options.search&&o.options.search.right&&(o.options.search.$right=s(o.options.search.right),o.$right.before(s(o.options.search.$right))),o.events(),"function"==typeof o.callbacks.afterInit&&o.callbacks.afterInit()},events:function(){var o=this;o.options.search&&o.options.search.$left&&o.options.search.$left.on("keyup",function(t){o.callbacks.fireSearch(this.value)?(o.$left.find('option:search("'+this.value+'")').mShow(),o.$left.find('option:not(:search("'+this.value+'"))').mHide(),o.$left.find("option").closest("optgroup").mHide(),o.$left.find("option:not(.hidden)").parent("optgroup").mShow()):o.$left.find("option, optgroup").mShow()}),o.options.search&&o.options.search.$right&&o.options.search.$right.on("keyup",function(t){o.callbacks.fireSearch(this.value)?(o.$right.find('option:search("'+this.value+'")').mShow(),o.$right.find('option:not(:search("'+this.value+'"))').mHide(),o.$right.find("option").closest("optgroup").mHide(),o.$right.find("option:not(.hidden)").parent("optgroup").mShow()):o.$right.find("option, optgroup").mShow()}),o.$right.closest("form").on("submit",function(t){o.options.search&&(o.options.search.$left&&o.options.search.$left.val("").trigger("keyup"),o.options.search.$right&&o.options.search.$right.val("").trigger("keyup")),o.$left.find("option").prop("selected",o.options.submitAllLeft),o.$right.find("option").prop("selected",o.options.submitAllRight)}),o.$left.on("dblclick","option",function(t){t.preventDefault();var e=o.$left.find("option:selected:not(.hidden)");e.length&&o.moveToRight(e,t)}),o.$left.on("click","optgroup",function(t){"OPTGROUP"==s(t.target).prop("tagName")&&s(this).children().prop("selected",!0)}),o.$left.on("keypress",function(t){var e;13===t.keyCode&&(t.preventDefault(),(e=o.$left.find("option:selected:not(.hidden)")).length&&o.moveToRight(e,t))}),o.$right.on("dblclick","option",function(t){t.preventDefault();var e=o.$right.find("option:selected:not(.hidden)");e.length&&o.moveToLeft(e,t)}),o.$right.on("click","optgroup",function(t){"OPTGROUP"==s(t.target).prop("tagName")&&s(this).children().prop("selected",!0)}),o.$right.on("keydown",function(t){var e;8!==t.keyCode&&46!==t.keyCode||(t.preventDefault(),(e=o.$right.find("option:selected:not(.hidden)")).length&&o.moveToLeft(e,t))}),(navigator.userAgent.match(/MSIE/i)||0<navigator.userAgent.indexOf("Trident/")||0<navigator.userAgent.indexOf("Edge/"))&&(o.$left.dblclick(function(t){o.actions.$rightSelected.trigger("click")}),o.$right.dblclick(function(t){o.actions.$leftSelected.trigger("click")})),o.actions.$rightSelected.on("click",function(t){t.preventDefault();var e=o.$left.find("option:selected:not(.hidden)");e.length&&o.moveToRight(e,t),s(this).blur()}),o.actions.$leftSelected.on("click",function(t){t.preventDefault();var e=o.$right.find("option:selected:not(.hidden)");e.length&&o.moveToLeft(e,t),s(this).blur()}),o.actions.$rightAll.on("click",function(t){t.preventDefault();var e=o.$left.children(":not(span):not(.hidden)");e.length&&o.moveToRight(e,t),s(this).blur()}),o.actions.$leftAll.on("click",function(t){t.preventDefault();var e=o.$right.children(":not(span):not(.hidden)");e.length&&o.moveToLeft(e,t),s(this).blur()}),o.actions.$undo.on("click",function(t){t.preventDefault(),o.undo(t)}),o.actions.$redo.on("click",function(t){t.preventDefault(),o.redo(t)}),o.actions.$moveUp.on("click",function(t){t.preventDefault();var e=o.$right.find(":selected:not(span):not(.hidden)");e.length&&o.moveUp(e,t),s(this).blur()}),o.actions.$moveDown.on("click",function(t){t.preventDefault();var e=o.$right.find(":selected:not(span):not(.hidden)");e.length&&o.moveDown(e,t),s(this).blur()})},moveToRight:function(t,e,o,n){var i=this;return"function"==typeof i.callbacks.moveToRight?i.callbacks.moveToRight(i,t,e,o,n):!("function"==typeof i.callbacks.beforeMoveToRight&&!o&&!i.callbacks.beforeMoveToRight(i.$left,i.$right,t))&&(i.moveFromAtoB(i.$left,i.$right,t,e,o,n),n||(i.undoStack.push(["right",t]),i.redoStack=[]),"function"!=typeof i.callbacks.sort.right||o||i.doNotSortRight||i.$right.mSort(i.callbacks.sort.right),"function"!=typeof i.callbacks.afterMoveToRight||o||i.callbacks.afterMoveToRight(i.$left,i.$right,t),i)},moveToLeft:function(t,e,o,n){var i=this;return"function"==typeof i.callbacks.moveToLeft?i.callbacks.moveToLeft(i,t,e,o,n):!("function"==typeof i.callbacks.beforeMoveToLeft&&!o&&!i.callbacks.beforeMoveToLeft(i.$left,i.$right,t))&&(i.moveFromAtoB(i.$right,i.$left,t,e,o,n),n||(i.undoStack.push(["left",t]),i.redoStack=[]),"function"!=typeof i.callbacks.sort.left||o||i.$left.mSort(i.callbacks.sort.left),"function"!=typeof i.callbacks.afterMoveToLeft||o||i.callbacks.afterMoveToLeft(i.$left,i.$right,t),i)},moveFromAtoB:function(t,c,e,o,n,i){var a=this;return"function"==typeof a.callbacks.moveFromAtoB?a.callbacks.moveFromAtoB(a,t,c,e,o,n,i):(e.each(function(t,e){var o,n,i,r,l=s(e);if(a.options.ignoreDisabled&&l.is(":disabled"))return!0;l.is("optgroup")||l.parent().is("optgroup")?(o=l.is("optgroup")?l:l.parent(),n="optgroup["+a.options.matchOptgroupBy+'="'+o.prop(a.options.matchOptgroupBy)+'"]',(i=c.find(n)).length||((i=o.clone(!0)).empty(),c.move(i)),l.is("optgroup")?(r="",a.options.ignoreDisabled&&(r=":not(:disabled)"),i.move(l.find("option"+r))):i.move(l),o.removeIfEmpty()):c.move(l)}),a)},moveUp:function(t){if("function"==typeof this.callbacks.beforeMoveUp&&!this.callbacks.beforeMoveUp(t))return!1;t.first().prev().before(t),"function"==typeof this.callbacks.afterMoveUp&&this.callbacks.afterMoveUp(t)},moveDown:function(t){if("function"==typeof this.callbacks.beforeMoveDown&&!this.callbacks.beforeMoveDown(t))return!1;t.last().next().after(t),"function"==typeof this.callbacks.afterMoveDown&&this.callbacks.afterMoveDown(t)},undo:function(t){var e=this.undoStack.pop();if(e)switch(this.redoStack.push(e),e[0]){case"left":this.moveToRight(e[1],t,!1,!0);break;case"right":this.moveToLeft(e[1],t,!1,!0)}},redo:function(t){var e=this.redoStack.pop();if(e)switch(this.undoStack.push(e),e[0]){case"left":this.moveToLeft(e[1],t,!1,!0);break;case"right":this.moveToRight(e[1],t,!1,!0)}}},t);function t(t,e){var o,n=t.prop("id");this.$left=t,this.$right=s(e.right).length?s(e.right):s("#"+n+"_to"),this.actions={$leftAll:s(e.leftAll).length?s(e.leftAll):s("#"+n+"_leftAll"),$rightAll:s(e.rightAll).length?s(e.rightAll):s("#"+n+"_rightAll"),$leftSelected:s(e.leftSelected).length?s(e.leftSelected):s("#"+n+"_leftSelected"),$rightSelected:s(e.rightSelected).length?s(e.rightSelected):s("#"+n+"_rightSelected"),$undo:s(e.undo).length?s(e.undo):s("#"+n+"_undo"),$redo:s(e.redo).length?s(e.redo):s("#"+n+"_redo"),$moveUp:s(e.moveUp).length?s(e.moveUp):s("#"+n+"_move_up"),$moveDown:s(e.moveDown).length?s(e.moveDown):s("#"+n+"_move_down")},delete e.leftAll,delete e.leftSelected,delete e.right,delete e.rightAll,delete e.rightSelected,delete e.undo,delete e.redo,delete e.moveUp,delete e.moveDown,this.options={keepRenderingSort:e.keepRenderingSort,submitAllLeft:void 0===e.submitAllLeft||e.submitAllLeft,submitAllRight:void 0===e.submitAllRight||e.submitAllRight,search:e.search,ignoreDisabled:void 0!==e.ignoreDisabled&&e.ignoreDisabled,matchOptgroupBy:void 0!==e.matchOptgroupBy?e.matchOptgroupBy:"label"},delete e.keepRenderingSort,e.submitAllLeft,e.submitAllRight,e.search,e.ignoreDisabled,e.matchOptgroupBy,this.callbacks=e,"function"==typeof this.callbacks.sort&&(o=this.callbacks.sort,this.callbacks.sort={left:o,right:o}),this.init()}i.multiselect={defaults:{startUp:function(n,t){t.find("option").each(function(t,e){var o;"OPTGROUP"==i(e).parent().prop("tagName")?(o='optgroup[label="'+i(e).parent().attr("label")+'"]',n.find(o+' option[value="'+e.value+'"]').each(function(t,e){e.remove()}),n.find(o).removeIfEmpty()):n.find('option[value="'+e.value+'"]').remove()})},afterInit:function(){return!0},beforeMoveToRight:function(t,e,o){return!0},afterMoveToRight:function(t,e,o){},beforeMoveToLeft:function(t,e,o){return!0},afterMoveToLeft:function(t,e,o){},beforeMoveUp:function(t){return!0},afterMoveUp:function(t){},beforeMoveDown:function(t){return!0},afterMoveDown:function(t){},sort:function(t,e){return"NA"==t.innerHTML||"NA"!=e.innerHTML&&t.innerHTML>e.innerHTML?1:-1},fireSearch:function(t){return 1<t.length}}};var e=window.navigator.userAgent,o=-3<e.indexOf("MSIE ")+e.indexOf("Trident/")+e.indexOf("Edge/"),n=-1<e.toLowerCase().indexOf("safari"),l=-1<e.toLowerCase().indexOf("firefox");i.fn.multiselect=function(n){return this.each(function(){var t=i(this),e=t.data("crlcu.multiselect"),o=i.extend({},i.multiselect.defaults,t.data(),"object"==typeof n&&n);e||t.data("crlcu.multiselect",e=new r(t,o))})},i.fn.move=function(t){return this.append(t).find("option").prop("selected",!1),this},i.fn.removeIfEmpty=function(){return this.children().length||this.remove(),this},i.fn.mShow=function(){return this.removeClass("hidden").show(),(o||n)&&this.each(function(t,e){i(e).parent().is("span")&&i(e).parent().replaceWith(e),i(e).show()}),l&&this.prop("disabled",!1),this},i.fn.mHide=function(){return this.addClass("hidden").hide(),(o||n)&&this.each(function(t,e){i(e).parent().is("span")||i(e).wrap("<span>").hide()}),l&&this.prop("disabled",!0),this},i.fn.mSort=function(o){return this.children().sort(o).appendTo(this),this.find("optgroup").each(function(t,e){i(e).children().sort(o).appendTo(e)}),this},i.fn.attachIndex=function(){this.children().each(function(t,e){var o=i(e);o.is("optgroup")&&o.children().each(function(t,e){i(e).data("position",t)}),o.data("position",t)})},i.expr[":"].search=function(t,e,o){var n=new RegExp(o[3].replace(/([^a-zA-Z0-9])/g,"\\$1"),"i");return i(t).text().match(n)}});