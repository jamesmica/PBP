$(document).ready(function () {

  $(document).on('click', '.vignette', function() {
    var vignetteTitle = $(this).find('.BP_title').text(); // ou tout autre élément qui contient un identifiant unique pour la vignette
    gtag('event', 'click', {
      'event_category': 'Vignettes',
      'event_label': vignetteTitle
    });
  });


  $(document).on('click', '.download-btn', function() {
    var downloadItem = $(this).attr('href'); // Ou tout autre attribut qui identifie de manière unique ce que l'utilisateur télécharge
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
    var selectedItem = this.options[this.selectedIndex].text; // Obtenir le texte de l'option sélectionnée
    // Utilisez 'gtag' pour envoyer un événement de suivi à Google Analytics
    gtag('event', 'select_content', {
        'content_type': 'sort_select',
        'item_id': selectedItem
    });
});

  // Initialisation de Selectize pour dep-nom-select avec gestion des changements
  $('#dep-nom-select').selectize({
    onChange: filterVignettes // Appel de la fonction de filtrage lors d'un changement de sélection
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



  var $select2 = $('#insee').selectize({
    valueField: 'INSEE',
    labelField: 'NOM_COUV',
    searchField: 'NOM_COUV',
    load: function(query, callback) {
        if (!query.length) return callback();
        // Supposons que vous avez déjà chargé vos données dans `selectize`
        callback();
    }
});
  
  var $select = $('#insee-select').selectize({
    valueField: 'INSEE',
    labelField: 'NOM_COUV',
    searchField: 'NOM_COUV',
    load: function(query, callback) {
        if (!query.length) return callback();
        // Supposons que vous avez déjà chargé vos données dans `selectize`
        callback();
    },
    onChange: function selectedInsee() {
      adjustAndSortVignettesData(selectedInsee);
      
    }
});

var selectize = $select[0].selectize;


var selectize2 = $select2[0].selectize;

// Supposons que vous avez chargé toutes vos options ici au démarrage
$.ajax({
    url: 'pertinence.json',
    type: 'GET',
    dataType: 'json'
});

let pertinenceData = [];

// Fonction pour charger les données de pertinence.json
function loadPertinenceData() {
  return $.ajax({
    url: 'pertinence.json',
    type: 'GET',
    dataType: 'json',
    success: function(res) {
        // Ajoutez toutes vos options à Selectize ici
        selectize.addOption(res); // Ajoute toutes les options au démarrage
        selectize.refreshOptions(); // Rafraîchit les options affichées
        selectize2.addOption(res);
        selectize2.refreshOptions();
    }
});
}

// Appel de la fonction de chargement des données et initialisation de Selectize après le chargement
loadPertinenceData().done(function(res) {
    pertinenceData = res; // Stockage des données chargées
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

      // Appliquez la logique d'ajustement
        //COMEPCI
      if ((inseeLength > 6 && String(vignette.ID).length >= 6 && vignette.PAYS === "France") || 
      (inseeLength > 3 && inseeLength < 7 && String(vignette.ID).length > 3 && String(vignette.ID).length < 7 && vignette.PAYS === "France")) {
          vignette.SCORE += 0.5;
      }
        //STRATE
      const strateValueNum = parseFloat(strateValue);
      const vignetteStrateNum = parseFloat(vignette.STRATE2);

      // Calcule la différence absolue entre strateValue et vignette.STRATE2
      const diff = Math.abs(strateValueNum - vignetteStrateNum);

      // Applique la logique d'ajustement basée sur la différence
      if (diff < 2) {
          vignette.SCORE += 1; // Ajoute +1 à la colonne SCORE
      } else if (diff >= 2 && diff < 3) {
          vignette.SCORE += 0.7; // Ajoute +0.7 à la colonne SCORE
      } else if (diff >= 3 && diff < 4) {
          vignette.SCORE += 0.5; // Ajoute +0.5 à la colonne SCORE
      } else if (diff >= 4 && diff < 5) {
        vignette.SCORE += 0.3; // Ajoute +0.5 à la colonne SCORE
      } else if (diff >= 5 && diff < 6) {
        vignette.SCORE += 0.1; // Ajoute +0.5 à la colonne SCORE
      }
        
        //GEOLOC
        //racine de ((xb-xa)²+(yb-ya)²)
      const XBP = parseFloat(vignette.X);
      const YBP = parseFloat(vignette.Y);
      const distances = Math.sqrt(Math.pow(XBP - XValue, 2) + Math.pow(YBP - YValue, 2)); // Correction de la formule

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

  // Trier vignettesData par SCORE décroissant
  vignettesData.sort((a, b) => parseFloat(b.SCORE) - parseFloat(a.SCORE));

  displayVignettes(vignettesData);
  // window.location.hash = '#decouvrir';
  history.pushState({page: 'decouvrir'}, '', '?page=decouvrir');
  handleNavigation();

}


    // Écoute du clic sur le document entier
    $(document).mouseup(function(e) {
        var container = $("#details-container"); // Sélection du conteneur des détails

        // Si le clic est en dehors du conteneur et que le conteneur est ouvert
        if (!container.is(e.target) && container.has(e.target).length === 0) {
            container.removeClass('open'); // Fermer le conteneur en retirant la classe 'open'
        }
    });



  // Variables globales pour stocker les données
  let vignettesData = [];

  // Fonction pour activer la section et le lien correspondants
  function activateSectionAndLink(page) {
    // Désactiver tous les liens et sections actifs
    $('.nav-link').removeClass('active');
    $('.main-section').removeClass('active');

    // Activer le lien correspondant
    $(`a[href="?page=${page}"]`).addClass('active');

    // Activer la section correspondante
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
    }
}


  // Écouteurs d'événements pour les liens de navigation
  $('.nav-link').on('click', function(e) {
    e.preventDefault(); // Empêcher le comportement par défaut

    // Récupérer le paramètre 'page' du lien cliqué
    const page = new URL(this.href).searchParams.get('page');
    
    // Mettre à jour l'URL sans recharger la page
    history.pushState({page: page}, '', '?page=' + page);

    // Charger la section correspondante
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

function updateCanonicalIfIdPresent() {
  // Extraire l'URL actuelle et les paramètres de recherche (query string)
  const currentUrl = new URL(window.location.href);
  const searchParams = currentUrl.searchParams;

  // Vérifier si le paramètre 'id' est présent
  if (searchParams.has('id')) {
    // Trouver ou créer la balise <link rel="canonical">
    let canonicalLink = document.querySelector("link[rel='canonical']");
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalLink);
    }

    // Mettre à jour l'attribut 'href' de la balise avec l'URL actuelle
    canonicalLink.setAttribute("href", currentUrl.href);
  }
}


  function displayDetails(id) {
    const details = vignettesData.find(item => item.detailsId === id);
    // Appeler la fonction pour mettre à jour la balise canonical
    updateCanonicalIfIdPresent();
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
    if (!details) {
      detailsContainer.html('Détail non trouvé.');
      return;
    }
    
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
      <img src="www/webpv/${details.WEBP}" class="BP_page_img" alt="${details.INTITULE}" loading="lazy"/>
      <a href="www/pdf/Bonnes Pratiques_Partie${details.N}.pdf" download="${details.INTITULE}">Télécharger en PDF<i class="fa-solid fa-download"></i></a>
      </div>
      <span itemprop="about" class="BP_page_description">
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
      // Modification du titre de la page
      document.title = "Plateforme Bonnes Pratiques";

      // Modification de la balise meta description
      var metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
          metaDescription.setAttribute('content', 'Aider les collectivités territoriales à orienter leurs politiques publiques à travers un répertoire complet de bonnes pratiques en France et en UE.');
      }
      detailsContainer.removeClass('open');
      history.pushState({page: '?decouvrir'}, '', '?page=decouvrir');
      handleNavigation();
    });
    
    history.pushState({page: 'decouvrir', id: id}, '', '?page=decouvrir&id=' + id);

    // Assurez-vous que le conteneur de détails est marqué comme ouvert si ce n'est pas déjà fait
    $("#details-container").addClass('open');
    var stateObj = { page: "decouvrir" };
    history.pushState(stateObj, '', '?page=decouvrir');
    history.pushState({page: 'decouvrir', id: id}, '', '?page=decouvrir&id=' + id);

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
              display: false // Cela enlèvera les lignes de la grille horizontale
            }
          },
          x: {
            // Ici, vous pouvez personnaliser les étiquettes des catégories
            grid: {
              display: true // Cela enlèvera les lignes de la grille verticale, si souhaité
            },
            max: 10
          }
        },
        plugins: {
          legend: {
            display: false // Cela supprimera la légende
          }
        }
      }
  };
  
  // Initialisez le graphique en utilisant l'élément canvas
  const myChart = new Chart(
      document.getElementById('myChart'),
      config
  );


  }

  let displayCount = 60; // Initialiser le nombre de vignettes à afficher

  $('#load-more-btn').on('click', function() {
    displayCount += 60; // Augmenter le nombre de vignettes à afficher de 50
  });

  // Fonction pour afficher les vignettes
  function displayVignettes(data) {
    const container = $('#vignettes-container');
    const loadMoreBtn = $('#load-more-btn').detach(); // Détacher le bouton temporairement
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
          window.history.pushState({ path: newUrl }, '', newUrl);
          handleNavigation();
        });
        container.append(vignette);

      }
    });


    container.append(loadMoreBtn); // Remettre le bouton dans le conteneur
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
    const sortBy = $('#sort-select').val(); // Récupérez la valeur de tri ici
  
    // Filtrer d'abord les données en fonction des critères de recherche
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
  
    // Ensuite, vérifier si une valeur de tri a été sélectionnée et appliquez le tri si nécessaire
    if (sortBy) {
      filteredData.sort((a, b) => {
        let valueA = isNaN(a[sortBy]) ? a[sortBy]?.toLowerCase() : parseFloat(a[sortBy]);
        let valueB = isNaN(b[sortBy]) ? b[sortBy]?.toLowerCase() : parseFloat(b[sortBy]);
        
        if (valueA < valueB) return 1; // Inverser ici
        if (valueA > valueB) return -1; // Et ici
        return 0;
      });
    }    
    
    displayVignettes(filteredData);
  }

  // Attachement des événements de filtrage
  $('#search-input').on('input', filterVignettes);
  $('#search-input').on('change', filterVignettes);
  $('#produit-select').on('change', filterVignettes);
  $('#load-more-btn').on('click', filterVignettes);
  $('#sort-select').on('change', filterVignettes);
  $('#insee-select').on('change', adjustAndSortVignettesData);

  // Chargement initial des données
 fetch('BDD_finale.csv')
    .then(response => response.text())
    .then(csvText => {
        Papa.parse(csvText, {
            header: true,
            complete: function (results) {
                vignettesData = results.data;
                // Assurez-vous que handleNavigation est appelé après le chargement des données
                handleNavigation(); // Ceci détermine quoi afficher basé sur l'URL
            }
        });
    });

function handleNavigation() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const page = urlParams.get('page') || 'accueil'; // Fallback sur 'accueil' si aucun paramètre n'est donné

    // Logique pour activer la section correspondante
    activateSectionAndLink(page);

    // Nouvelle logique pour appeler displayVignettes ou displayDetails en fonction des paramètres de l'URL
    if (page === 'decouvrir') {
        const id = urlParams.get('id');
        filterVignettes();
        if (id) {
            // Affiche les détails pour un ID spécifique
            displayDetails(id);
        }

    if (page === 'decouvrir' && !id) {
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
    // Ajoutez ici d'autres conditions pour d'autres valeurs de 'page' si nécessaire
}

    // Écouteur pour les changements d'état de l'historique
    window.addEventListener('popstate', function(event) {
      // Gère le changement d'état ici
      if (event.state) {
        recover();
      }

      handleNavigation(); // Gère le chargement initial basé sur l'URL actuelle


  });

  function recover() {
    var detailsContainer = document.querySelector('#details-container');

    if (!detailsContainer) {
        return; // Sortie précoce si l'élément n'existe pas
    }

    // Obtenez l'URL actuelle
    var url = window.location.href;

    // Vérifiez si l'URL contient un identifiant (id)
    var hasId = url.includes('id=');

    // Ajoutez ou enlevez la classe open basé sur la présence de l'id
    if (hasId) {
        detailsContainer.classList.add('open');
    } else {
        detailsContainer.classList.remove('open');
    }
  }

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
    
});
