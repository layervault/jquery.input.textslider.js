(function($) {
  var
    options = {
      ratio     : 0.01,
      precision : 2
    },
    swapForAnchor,
    swapForInput,
    nextId,
    setupTextSlider,
    bindClicks,
    onAnchorClick,
    onAnchorMousedown,
    onAnchorMouseup,
    onAnchorMousemove,
    changeValueFor,
    onInputBlur,
    shiftDown,
    controlDown,
    onKeyDown,
    onKeyUp,
    ratio,
    inputFor,
    anchorFor;

  nextId = (function () {
    var id = 0;
    return function () {
      return 'LV-' + (id++);
    };
  }());

  swapForAnchor = function ($e) {
    $e.hide();
    $('[data-id="' + $e.attr('data-anchor-class') + '"]').show();
  };

  swapForInput = function ($a) {
    var $input = inputFor($a);
    $a.hide();
    $input.show();
  };

  inputFor = function ($a) {
    if (!$a.hasClass('LVTextSliderAnchor')) {
      return null;
    }

    return $('input[data-anchor-class="' + $a.attr('data-id') + '"]');
  };

  anchorFor = function ($i) {
    return $('.LVTextSliderAnchor[data-id="' + $i.attr('data-anchor-class') + '"]');
  };

  changeValueFor = function ($e, x, y) {
    var
      $input = inputFor($e),
      startingX = parseInt($e.attr('data-starting-x'), 10),
      currentValue = parseFloat($e.attr('data-starting-value'), 10),
      newValue = currentValue + ((x - startingX) * ratio());

    newValue = Number(newValue.toFixed(options.precision));
    $input.val(newValue);
    $e.trigger('jquery.textslider.changed');
  };

  ratio = function () {
    var
      controlRatio = controlDown ? 0.1 : 1.0,
      shiftRatio = shiftDown ? 5.0 : 1.0;

    return options.ratio * controlRatio * shiftRatio;
  };

  precision = function ($a) {
    var
      $input = inputFor($a),
      precision;

    if ($input.length > 0) {
      preicion = parseInt($input.attr('data-precision'), 10);
    }

    if (isNaN(precision) || !precision) {
      precision = options.precision;
    }

    return precision;
  };

  setupTextSlider = function ($e) {
    var
      id = nextId(),
      $anchor = $('<a class="LVTextSliderAnchor" href="#"></a>');

    $e.blur(onInputBlur);

    $anchor
      .text($e.val())
      .css('position', 'absolute')
      .css('top', $e.offset().top)
      .css('left', $e.offset().left)
      .css('cursor', 'pointer')
      .css('-webkit-user-drag', 'none')
      .width($e.width())
      .height($e.height())
      .attr('data-id', id)
      .addClass()
      .hide();

    $anchor.click(onAnchorClick);
    $anchor.mousedown(onAnchorMousedown);
    $anchor.on('jquery.textslider.changed', function () {
      var $a = $(this);
      $a.text(inputFor($a).val());
    });
    // $anchor.mousedown(onAnchorMouseup);

    $('body').append($anchor);

    $e.attr('data-anchor-class', id);
    swapForAnchor($e);
  };

  //-- Methods to attach to jQuery sets

  $.fn.textslider = function() {
    var $elements = $(this);

    $elements.each(function () {
      setupTextSlider($(this));
    });

    bindClicks();
    bindKeys();
  };

  //-- Event methods

  onInputBlur = function (event) {
    var
      $target = $(event.target),
      $a = anchorFor($target),
      newValue = parseFloat($target.val(), 10);

    newValue = newValue.toFixed(options.precision);

    $target.val(newValue);
    swapForAnchor($target);
    $a.trigger('jquery.textslider.changed');
  };

  onAnchorClick = function (event) {
    var
      $target = $(event.target),
      $input = inputFor($target);

    swapForInput($target);
    $input.focus();
    return false;
  };

  onAnchorMouseup = function (event) {
    $('[data-scrolling]').attr('data-scrolling', null);
  };

  onAnchorMousedown = function (event) {
    var $a = $(event.target);

    $a
      .attr('data-starting-value', inputFor($a).val())
      .attr('data-scrolling', true)
      .attr('data-starting-x', event.pageX)
      .attr('data-starting-y', event.pageY);
  };

  onAnchorMousemove = function (event) {
    if ($('[data-scrolling]').length === 0) {
      return;
    }

    changeValueFor($('[data-scrolling]'), event.pageX, event.pageY);
  };

  onKeyDown = function (event) {
    if (event.ctrlKey) {
      controlDown = true;
    }

    if (event.shiftKey) {
      shiftDown = true;
    }
  };

  onKeyUp = function (event) {
    if (!event.ctrlKey) {
      controlDown = false;
    }

    if (!event.shiftKey) {
      shiftDown = false;
    }
  };

  //-- Methods that should be bound up right away

  bindClicks = function () {
    $(document).on('mouseup',   onAnchorMouseup);
    $(document).on('mousemove', onAnchorMousemove);
  };

  bindKeys = function () {
    $(document).on('keydown', onKeyDown);
    $(document).on('keyup',   onKeyUp);
  };
})(jQuery);
