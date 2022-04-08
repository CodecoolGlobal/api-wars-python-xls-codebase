$(function() {
    init();
});


function init() {
    addLabels()
    mobileTableCheck();
    $(window).on('resize', mobileTableCheck);
    $('body').prepend(modalHTML)
    ajaxButtons()
}

function ajaxButtons() {
    $('.btn-residents').on( 'click', event => {
        event.preventDefault();
        let planetId = $(event.target).data('planet_id')
        let planetName = $(event.target).data('planet_name')
        showResidents(planetId, planetName)
    })
}

function addLabels() {
    let labels = [];
    $('#planet-table th').each(function() {
        labels.push($(this).html())
    })
    $('#planet-table tr').each( function() {
        $(this).find('td').not(':last').each(function (i) {
            $(this).prepend('<span class="label">' + labels[i] + ': </span>')
        })
    })
}

function mobileTableCheck() {
    if (window.matchMedia("only screen and (max-width: 576px)").matches) {
        $('#planet-table tr').addClass('row');
        $('#planet-table th, #planet-table td').addClass('col-');
        $('#planet-table').closest('div').removeClass('table-responsive')
        $('#planet-table thead').hide()
        $('#planet-table .label').show()
        $('.pagination').addClass('d-flex justify-content-between')
        $('.pagination .btn').addClass('col-5')
        $('#planet-table tr td:last-child .btn').addClass('d-grid')
        $('#planet-table > :not(:first-child)').addClass('no-border')
    } else {
        $('#planet-table tr').removeClass('row');
        $('#planet-table th, #planet-table td').removeClass('col-');
        $('#planet-table').closest('div').addClass('table-responsive')
        $('#planet-table thead').show()
        $('#planet-table .label').hide()
        $('.pagination').removeClass('d-flex justify-content-between')
        $('.pagination .btn').removeClass('col-5')
        $('#planet-table tr td:last-child .btn').removeClass('d-grid')
        $('#planet-table > :not(:first-child)').removeClass('no-border')
    }
}

function showResidents(planetId, planetName) {
    var myModal = new bootstrap.Modal(document.getElementById('residents-modal'))
    let title = 'Residents of ' + planetName;
    $('.modal-title').html(title)
    $('#residents-modal .modal-body').html(spinner)
    myModal.show()
    url = '/planet/' + planetId + '/residents'
    $.get(url, function (data) {
        let table = $(data).find('.table-responsive');
        $('.modal-body').html(table);
  })
}

modalHTML = `
<div id="residents-modal" class="modal" tabindex="-1">
  <div class="modal-dialog modal-xl">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title"></h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>
`
spinner = `
<div class="d-flex justify-content-center">
<div class="d-flex justify-content-center">
  <div class="spinner-border text-primary" role="status">
    <span class="visually-hidden">Loading...</span>
  </div>
</div>
`