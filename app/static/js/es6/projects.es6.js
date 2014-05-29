(function(){
  'use strict';

  $(document).ready(init);

  function init(){
    $('.editForm').hide();
    $('#projects').on('click', '#editButton', bringUpEdit);
  }

  function bringUpEdit(){
    $(this).siblings('.editForm').toggle();
  }

})();
