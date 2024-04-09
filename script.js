$(document).ready(function () {


  $(document).on('click', '.vignette', function() {
    var vignetteTitle = $(this).find('.BP_title').text();
    gtag('event', 'click', {
      'event_category': 'Vignettes',
      'event_label': vignetteTitle
    });
  });
  $(document).on('click', '.download-btn', function() {
    var downloadItem = $(this).attr('href');
    gtag('event', 'download', {
      'event_category': 'Download',
      'event_label': downloadItem
    });
  });
  document.getElementById('submitButton').addEventListener('click', function() {
    gtag('event', 'submit', {
      'event_category': 'Form Submission',
      'event_label': 'Bonne Pratique Form'
    });
  });
  document.getElementById('addBP').addEventListener('click', function() {
    gtag('event', 'click', {
      'event_category': 'Add BP Button',
      'event_label': 'Add Bonne Pratique'
    });
  });
  document.getElementById('sort-select').addEventListener('change', function() {
    var selectedItem = this.options[this.selectedIndex].text;
    gtag('event', 'select_content', {
        'content_type': 'sort_select',
        'item_id': selectedItem
    });
});

  $('#dep-nom-select').selectize({
    onChange: filterVignettes
  });

  $('#produit-select').selectize({
    onChange: filterVignettes
  });

  $('#strate-select').selectize({
    onChange: filterVignettes
  });

  $('#sort-select').selectize({
    onChange: filterVignettes
  });

$.ajax({
    url: 'pertinence.json',
    type: 'GET',
    dataType: 'json'
});

  $('#search-input').on('input', filterVignettes);
  $('#search-input').on('change',  $(this).blur());
  $('#produit-select').on('change', filterVignettes);
  $('#load-more-btn').on('click', filterVignettes);
  $('#sort-select').on('change', filterVignettes);
  $('#insee-select').on('change', adjustAndSortVignettesData);

    window.addEventListener('popstate', function(event) {
        recover();
        handleNavigation();
  });

  var sc = document.getElementById('sans_collectivite');

  sc.addEventListener('click', function() {
    history.pushState({page: 'decouvrir'}, '', '?page=decouvrir');
    handleNavigation();
  });

  document.getElementById('addBP').addEventListener('click',function() {
    var addBP = document.getElementById('bpForm');
    addBP.classList.toggle("addbpvisible");
  });

  $('.close-btn-addbp').on('click', function () {
    var container = document.getElementById('bpForm')
    container.classList.toggle('addbpvisible');
  });

  const urlParams = new URLSearchParams(window.location.search);
  const page = urlParams.get('page');
  const id2 = urlParams.get('id');

  if (page === 'decouvrir' && id2) {
    history.pushState({page: 'decouvrir'}, '', '?page=decouvrir');
    history.pushState({page: 'decouvrir', id: id2}, '', '?page=decouvrir&id=' + id2);
  }
    
}); //end of DOM loaded listener

var $select2 = $('#insee').selectize({
  valueField: 'INSEE',
  labelField: 'NOM_COUV',
  searchField: 'NOM_COUV',
  load: function(query, callback) {
      if (!query.length) return callback();
      callback();
  }
});

var $select = $('#insee-select').selectize({
  valueField: 'INSEE',
  labelField: 'NOM_COUV',
  searchField: 'NOM_COUV',
  load: function(query, callback) {
      if (!query.length) return callback();
      callback();
  },
  onChange: function selectedInsee() {
    adjustAndSortVignettesData(selectedInsee);
    
  }
});

var selectize = $select[0].selectize;
var selectize2 = $select2[0].selectize;

  $('#load-more-btn').on('click', function() {
    displayCount += 60;
  });

  let pertinenceData = [];
  function loadPertinenceData() {
    return $.ajax({
      url: 'pertinence.json',
      type: 'GET',
      dataType: 'json',
      success: function(res) {
          selectize.addOption(res);
          selectize2.addOption(res);
      }
  });
  }
  
  loadPertinenceData().done(function(res) {
      pertinenceData = res;
  });
  
  function adjustAndSortVignettesData(selectedInsee) {
    vignettesData.forEach(function(vignette) {
      vignette.SCORE = 1;
  });
    //COMEPCI
    const selectElement = document.getElementById('insee-select');
    const inseeLength = selectElement.selectedOptions[0].value.length;
  
    if (!inseeLength) {
      return ;
    }
    //STRATE
    const inseeValue = selectElement.selectedOptions[0].value;
    const selectedData = pertinenceData.find(item => String(item.INSEE) === String(inseeValue));
  
    const strateValue = selectedData.STRATE;
    //GEOLOC
    const XValue = parseFloat(selectedData.X);
    const YValue = parseFloat(selectedData.Y);
  
    //SCORING
    vignettesData.forEach((vignette,index) => {
        vignette.SCORE = parseFloat(vignette.SCORE);
  
          //COMEPCI
        if ((inseeLength > 6 && String(vignette.ID).length >= 6 && vignette.PAYS === "France") || 
        (inseeLength > 3 && inseeLength < 7 && String(vignette.ID).length > 3 && String(vignette.ID).length < 7 && vignette.PAYS === "France")) {
            vignette.SCORE += 0.5;
        }
          //STRATE
        const strateValueNum = parseFloat(strateValue);
        const vignetteStrateNum = parseFloat(vignette.STRATE2);
        const diff = Math.abs(strateValueNum - vignetteStrateNum);
        if (diff < 2) {
            vignette.SCORE += 1;
        } else if (diff >= 2 && diff < 3) {
            vignette.SCORE += 0.7;
        } else if (diff >= 3 && diff < 4) {
            vignette.SCORE += 0.5; 
        } else if (diff >= 4 && diff < 5) {
          vignette.SCORE += 0.3; 
        } else if (diff >= 5 && diff < 6) {
          vignette.SCORE += 0.1;
        }   
          //GEOLOC
          //racine de ((xb-xa)²+(yb-ya)²)
        const XBP = parseFloat(vignette.X);
        const YBP = parseFloat(vignette.Y);
        const distances = Math.sqrt(Math.pow(XBP - XValue, 2) + Math.pow(YBP - YValue, 2));
  
        if (distances > 800000) {
          vignette.SCORE += 0;
        } else if (distances > 600000) {
          vignette.SCORE += 0.1;
        } else if (distances > 400000) {
          vignette.SCORE += 0.2;
        } else if (distances > 200000) {
          vignette.SCORE += 0.4;
        } else if (distances > 100000) {
          vignette.SCORE += 0.7;
        } else if (distances > 40000) {
          vignette.SCORE += 0.8;
        } else if (distances < 40001 || String(inseeValue) === String(vignette.INSEE)) {
          vignette.SCORE += 1;
        }
    });
  
    vignettesData.sort((a, b) => parseFloat(b.SCORE) - parseFloat(a.SCORE));
  
    displayVignettes(vignettesData);
    history.pushState({page: 'decouvrir'}, '', '?page=decouvrir');
    handleNavigation();
  
  }
  
  $('.nav-link').on('click', function(e) {
    e.preventDefault();
    const page = new URL(this.href).searchParams.get('page');
    history.pushState({page: page}, '', '?page=' + page);
    handleNavigation();
});

function resetFilters() {
  var selectizes = $('.selectized').selectize();
  $.each(selectizes, function(index, select) {
      var control = select.selectize;
      control.clear();
  });

  var input = document.getElementById('search-input');
  var tri = document.getElementById('sort-select');
  if (input) {
      input.value = '';
      input.dispatchEvent(new Event('input'));
      input.dispatchEvent(new Event('change'));
  }
  if (tri) {
      tri.selectedIndex = 0;
      $(tri).change();
  }

}

// function updateCanonicalIfIdPresent() {
//   const currentUrl = new URL(window.location.href);
//   const searchParams = currentUrl.searchParams;

//   if (searchParams.has('id')) {
//     let canonicalLink = document.querySelector("link[rel='canonical']");
//     if (!canonicalLink) {
//       canonicalLink = document.createElement("link");
//       canonicalLink.setAttribute("rel", "canonical");
//       document.head.appendChild(canonicalLink);
//     }

//     canonicalLink.setAttribute("href", currentUrl.href);
//   }
// }
