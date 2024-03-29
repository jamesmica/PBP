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

 fetch('BDD_finale.csv')
    .then(response => response.text())
    .then(csvText => {
        Papa.parse(csvText, {
            header: true,
            complete: function (results) {
                vignettesData = results.data;
                handleNavigation();
            }
        });
    });

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

  let vignettesData = [];
  let displayCount = 60;
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




function setMetaProperty(property, content) {
  let head = document.getElementsByTagName('head')[0];
  let meta = document.createElement('meta');
  meta.setAttribute('property', property);
  meta.setAttribute('content', content);
  head.appendChild(meta);
}

function removeMetaProperty(property) {
  let head = document.getElementsByTagName('head')[0];
  let metas = document.querySelectorAll(`meta[property='${property}']`);
  metas.forEach(meta => {
    head.removeChild(meta);
  });
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

function displayDetails(id) {
  const details = vignettesData.find(item => item.detailsId === id);
  // updateCanonicalIfIdPresent();
  removeMetaProperty('og:title');
  removeMetaProperty('og:type');
  removeMetaProperty('og:image');
  removeMetaProperty('og:url');
  removeMetaProperty('og:description');
  document.title = details.INTITULE;
  document.querySelector('meta[name="description"]').setAttribute("content", details.DESCRIPTION1);
  setMetaProperty('og:title', `${details.INTITULE}`);
  setMetaProperty('og:type', 'article');
  setMetaProperty('og:image', `${details.WEBP}`);
  setMetaProperty('og:url', 'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=' + `${details.detailsId}`);
  setMetaProperty('og:description', `${details.DESCRIPTION1}`);

  const detailsContainer = $('#details-container');
  
  var style = document.createElement('style');
  var newStyle = `
  .BP_page_background {
    background-image: url(www/webp/${details.WEBP});
  }
  `;
  style.innerHTML = newStyle
  document.head.appendChild(style);

  var detailsMarkup = `
    <div class="close-btn">✖ Fermer</div>
    <div class="BP_page_background"></div>
    <h2 itemprop="name">${details.INTITULE} - ${details.TER} (${details.DEP_NOM})</h2>
    <h3><span itemprop="location">${details.PAYS}</span> | <span itemprop="location">${details.TER}</span> (${parseInt(details.POP).toLocaleString()} hab.) | <span itemprop="startDate">${details.ANNEE}</span> </h3>
    <div class="BP_page_content">
    <div class="BP_page_imgdownload">
    <img itemprop="image" src="www/webpv/${details.WEBP}" class="BP_page_img" alt="${details.INTITULE}" loading="lazy"/>
    <a href="www/pdf/Bonnes Pratiques_Partie${details.N}.pdf" download="${details.INTITULE}">Télécharger en PDF<i class="fa-solid fa-download"></i></a>
    </div>
    <span itemprop="description" class="BP_page_description">
    <p>${details.DESCRIPTION1}</p>
    <p>${details.DESCRIPTION2}</p>
    <p>${details.DESCRIPTION3}</p>
    </span>
    <div class="BP_page_graphref">
    <span class="BP_page_ref">
    <h4>Portée par </h4>
    <p>${details.CREDIT}</p>
    <h4>Contact</h4>
    <p>${details.CONTACT}</p>
    <a href="${details.LINK}">Voir la bonne pratique (lien externe)</a>
    </span>
    <div id="div_myChart" style="width: 360px; height: 200px;">
    <canvas id="myChart" width="360" height="200"></canvas>
    <div class="info-icon"><img src="/www/info.png" alt="info-icon" style="height:24px;width:24px;"/>
        <div class="tooltip">
            Ces critères ont été choisis afin de pouvoir mieux se repérer entre les centaines de bonnes pratiques de notre base de données. Ils ont été définis par les différents rédacteurs des fiches Bonnes Pratiques à partir de nos propres indicateurs d’évaluations.<br><br><br>
            <strong>Essaimable</strong>: Si la bonne pratique a une note élevée à ce critère, cela signifie que le projet est adapté à tout type de collectivité. A contrario, si la notation est moins élevée, cela peut vouloir dire que le projet est atypique et ne correspond qu’à une certaine typologie de collectivités (territoire littoral ? territoire très touristique ?).<br><br>
            <strong>Économique</strong>: Si la bonne pratique coûte peu cher à mettre en œuvre et demande peu de moyens (moyens financiers, ressources humaines, etc.), alors la note est forcément élevée !<br><br>
            <strong>Facile à organiser</strong>: Si la bonne pratique a une note élevée à ce critère, cela signifie que sa mise en œuvre ne demande que peu de préparation ou d’organisation.<br><br>
            <strong>Innovant</strong>: Si la note au critère Innovant est élevée, cela veut dire que l’innovation sociale, écologique, économique est au cœur de la mise en œuvre de cette bonne pratique !<br><br>
            <strong>Original</strong>: La bonne pratique aura une note élevée au critère d’originalité si elle est inédite et inspirante !<br><br>
            <strong>Valorisable</strong>: Si la bonne pratique a une note élevée à ce critère, cela veut dire que le projet mis en œuvre nous semble très attractif : lorsqu’on lit le titre, on a tout de suite envie d’en savoir plus !
        </div>
    </div>
    </div>
    </div>
    </div>
  `;
  detailsContainer.html(detailsMarkup).addClass('open');

  $('.close-btn').on('click', function () {
    document.title = "Plateforme Bonnes Pratiques";
    var metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
        metaDescription.setAttribute('content', 'Aider les collectivités territoriales à orienter leurs politiques publiques à travers un répertoire complet de bonnes pratiques en France et en UE.');
    }
    detailsContainer.removeClass('open');
    history.pushState({page: 'decouvrir'}, '', '?page=decouvrir');
    handleNavigation();
  });
  

  $("#details-container").addClass('open');
  const detailsc = document.getElementById('details-container');
  detailsc.setAttribute("itemscope","");
  detailsc.setAttribute("itemtype","https://schema.org/Event");
  
  const chartData = {
    labels: ['Essaimable', 'Économique', 'Facile', 'Innovant', 'Original', 'Valorisable'],
    datasets: [{
        label: 'Évaluation',
        data: [details.Essaimable, details.Économique, details.Facile, details.Innovant, details.Original, details.Valorisable],
        backgroundColor: [
          '#f9b832',
          '#eb2c30',
          '#f38331',
          '#96d322',
          '#1db5c5',
          '#5c368d'
        ],
        borderColor: [
          '#f9b832',
          '#eb2c30',
          '#f38331',
          '#96d322',
          '#1db5c5',
          '#5c368d'
        ],
        borderWidth: 1
    }]
};

const config = {
    type: 'bar',
    data: chartData,
    options: {
      indexAxis: 'y',
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            display: false
          }
        },
        x: {
          grid: {
            display: true
          },
          max: 10
        }
      },
      plugins: {
        legend: {
          display: false 
        }
      }
    }
};

const myChart = new Chart(
    document.getElementById('myChart'),
    config
);


}

function displayVignettes(data) {
  const container = $('#vignettes-container');
  const loadMoreBtn = $('#load-more-btn').detach();
  container.empty(); 

  const dataToDisplay = data.slice(0, displayCount);

  dataToDisplay.forEach(item => {
    if (item.INTITULE) {
      const vignette = $(`
        <div class="vignette">
          <div class="details-link" tabindex="0">
            <img src="www/webp/${item.WEBP}" alt="${item.INTITULE}" loading="lazy"/>
            <div class="BP_text">
              <h2 class="BP_title">${item.INTITULE} - ${item.TER} (${item.DEP_NOM})</h2>
              <p class="BP_caption">${item.DESCRIPTION1}</p>
              <a href="https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=${item.detailsId}">${item.detailsId}</a>
            </div>
          </div>
        </div>
      `).on('click', () => {
        displayDetails(item.detailsId);
        const newUrl = `?page=decouvrir&id=${item.detailsId}`;
        history.pushState({ path: newUrl }, '', newUrl);
      });
      container.append(vignette);
    }
  });


  container.append(loadMoreBtn);
  if (displayCount >= $(data).length || ($(data).length < 60 || displayCount > 659)) {
      $('#load-more-btn').hide();
  } else {
      $('#load-more-btn').show();
  }

  if ($(data).length <1) {
      container.append('<p>Aucune bonne pratique ne correspond à votre recherche.</p>')
  }

}


  // Fonction de filtrage/tri des vignettes
  function filterVignettes() {
    const query = $('#search-input').val().toLowerCase();
    const strate = $('#strate-select').val();
    const depnom = $('#dep-nom-select').val();
    const thema = $('#produit-select').val();
    const sortBy = $('#sort-select').val();
  
    const filteredData = vignettesData.filter(item => {
      const themaMatch = thema.length === 0 || [item.THEMA1, item.THEMA2, item.THEMA3, item.THEMA4].some(themaItem => thema.includes(String(themaItem)));
      return (item.DEP?.toLowerCase().includes(query) ||
              item.TER?.toLowerCase().includes(query) ||
              item.DEP_NOM?.toLowerCase().includes(query) ||
              item.INTITULE?.toLowerCase().includes(query) ||
              item.SYNONYMES1?.toLowerCase().includes(query) ||
              item.SYNONYMES2?.toLowerCase().includes(query) ||
              item.SYNONYMES3?.toLowerCase().includes(query) ||
              item.DESCRIPTION1?.toLowerCase().includes(query) ||
              item.DESCRIPTION2?.toLowerCase().includes(query) ||
              item.DESCRIPTION3?.toLowerCase().includes(query)) &&
             (item.STRATE === strate || strate === "") &&
             (item.DEP_NOM === depnom || depnom === "") &&
             themaMatch;
    });
  
    if (sortBy) {
      filteredData.sort((a, b) => {
        let valueA = isNaN(a[sortBy]) ? a[sortBy]?.toLowerCase() : parseFloat(a[sortBy]);
        let valueB = isNaN(b[sortBy]) ? b[sortBy]?.toLowerCase() : parseFloat(b[sortBy]);
        
        if (valueA < valueB) return 1;
        if (valueA > valueB) return -1;
        return 0;
      });
    }    
    
    displayVignettes(filteredData);
  }


function handleNavigation() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const page = urlParams.get('page') || 'accueil';

  $('.nav-link').removeClass('active');
  $('.main-section').removeClass('active');

  $(`a[href="?page=${page}"]`).addClass('active');
  $('#' + page).addClass('active');

  if (page==='thematiques') {
    removeMetaProperty('og:title');
    removeMetaProperty('og:type');
    removeMetaProperty('og:image');
    removeMetaProperty('og:url');
    removeMetaProperty('og:description');
    document.title = "Plateforme Bonnes Pratiques - " + "Thématiques";
    document.querySelector('meta[name="description"]').setAttribute("content", "Explorez librement notre bibliothèque à travers des thématiques sélectionnées et accédez rapidement aux bonnes pratiques pertinentes.");
    setMetaProperty('og:title', "Plateforme Bonnes Pratiques - Thématiques");
    setMetaProperty('og:type', 'website');
    setMetaProperty('og:url', 'https://bonnes-pratiques.ithea-conseil.fr/?page=thematiques');
    setMetaProperty('og:description', "Explorez librement notre bibliothèque à travers des thématiques sélectionnées et accédez rapidement aux bonnes pratiques pertinentes.");
  } else if (page==='accueil') {
    removeMetaProperty('og:title');
    removeMetaProperty('og:type');
    removeMetaProperty('og:image');
    removeMetaProperty('og:url');
    removeMetaProperty('og:description');
    document.title = "Plateforme Bonnes Pratiques";
    document.querySelector('meta[name="description"]').setAttribute("content", "Aider les collectivités territoriales à orienter leurs politiques publiques à travers un répertoire complet de bonnes pratiques en France et en UE.");
    setMetaProperty('og:title', "Plateforme Bonnes Pratiques");
    setMetaProperty('og:type', 'website');
    setMetaProperty('og:url', 'https://bonnes-pratiques.ithea-conseil.fr/?page=accueil');
    setMetaProperty('og:description', "Aider les collectivités territoriales à orienter leurs politiques publiques à travers un répertoire complet de bonnes pratiques en France et en UE.");
  } else if (page === 'decouvrir') {
      const id = urlParams.get('id');
      filterVignettes();
      if (id) {
          displayDetails(id);
      } else {    
      removeMetaProperty('og:title');
      removeMetaProperty('og:type');
      removeMetaProperty('og:image');
      removeMetaProperty('og:url');
      removeMetaProperty('og:description');
      document.title = "Plateforme Bonnes Pratiques - " + "Découvrir";
      document.querySelector('meta[name="description"]').setAttribute("content", "Explorez + de 700 bonnes pratiques poussées par les collectivités territoriales en France et en UE. Filtrez et recherchez par thématique, territoire ou strate de population.");
      setMetaProperty('og:title', "Plateforme Bonnes Pratiques - Découvrir");
      setMetaProperty('og:type', 'website');
      setMetaProperty('og:image', "https://bonnes-pratiques.ithea-conseil.fr/decouvrir.jpg");
      setMetaProperty('og:url', 'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir');
      setMetaProperty('og:description', "Explorez + de 700 bonnes pratiques poussées par les collectivités territoriales en France et en UE. Filtrez et recherchez par thématique, territoire ou strate de population.");
    }
  }
}

function recover() {
  var detailsContainer = document.querySelector('#details-container');
  var url = window.location.href;
  var hasId = url.includes('id=');
  if (hasId) {
      detailsContainer.classList.add('open');
  } else {
      detailsContainer.classList.remove('open');
  }
}