$(document).ready(function () {
  function handleInitialLoad() {
    const path = window.location.pathname;
    // Convertit le chemin /exemple1/exemple2 en paramètres ?page=exemple1&id=exemple2
    const params = path.split('/').filter(Boolean);
    if (params.length > 1) {
        const page = params[0];
        const id = params[1];
        // Simuler une mise à jour de l'URL sans rechargement
        history.replaceState({}, '', `/?page=${page}&id=${id}`);
        // Charger le contenu basé sur page et id
        console.log('state replaced by : ','/' + page +'/' + id);
    }
  }
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
  console.log("length.insee",inseeLength);
  //STRATE
  const inseeValue = selectElement.selectedOptions[0].value;
  const selectedData = pertinenceData.find(item => String(item.INSEE) === String(inseeValue));
  if (selectedData) {
    const strateValue = selectedData.STRATE;
    console.log('STRATE trouvée:', strateValue);
    // Ici, vous pouvez ajuster les vignettesData basé sur la STRATE trouvée
  } else {
    console.log('Aucune STRATE trouvée pour cet INSEE');
  }
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

  // Afficher le tableau après le tri pour vérification
  console.log(vignettesData);
  displayVignettes(vignettesData);
  // window.location.hash = '#decouvrir';
  history.pushState({page: 'decouvrir'}, '', '/decouvrir');
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
    console.log('paramètre page : ',page);
    $('.nav-link').removeClass('active');
    $('.main-section').removeClass('active');

    // Activer le lien correspondant
    $(`a[href="/${page}"]`).addClass('active');

    // Activer la section correspondante
    $('#' + page).addClass('active');
}


  // Écouteurs d'événements pour les liens de navigation
  $('.nav-link').on('click', function(e) {
    e.preventDefault(); // Empêcher le comportement par défaut
    console.log('href : ',this.href.split('//')[1].split('/')[1]);
    // Récupérer le paramètre 'page' du lien cliqué
    var page = this.href.split('//')[1].split('/')[1]// Utilisez le premier segment comme 'page'
    
    // Mettre à jour l'URL sans recharger la page
    history.pushState({page: page}, '', '/' + page);

    // Charger la section correspondante
    handleNavigation();
});

  // Fonction pour afficher les détails d'une vignette
  function displayDetails(id) {
    const details = vignettesData.find(item => item.MOTCLES === id);
    // Modification du titre de la page
    document.title = "Plateforme Bonnes Pratiques - " + `${details.INTITULE}`;

    // Modification de la balise meta description
    var metaDescription = document.querySelector('meta[name="description"]');
    var metaText = `${details.DESCRIPTION1}`;
    if (metaDescription) {
        metaDescription.setAttribute('content', metaText);
    }
    const detailsContainer = $('#details-container');
    if (!details) {
      detailsContainer.html('Détail non trouvé.');
      return;
    }
    
    var style = document.createElement('style');
    var newStyle = `
    .BP_page_background {
      background-image: url(/www/webp/${details.WEBP});
    }
    `;
    style.innerHTML = newStyle
    document.head.appendChild(style);

    var detailsMarkup = `
      <div class="close-btn">✖ Fermer</div>
      <div class="BP_page_background"></div>
      <h2>${details.INTITULE} - ${details.TER} (${details.DEP_NOM})</h2>
      <h4>${details.PAYS} | ${details.TER} (${parseInt(details.POP).toLocaleString()} hab.) | ${details.ANNEE} </h4>
      <div class="BP_page_content">
      <div class="BP_page_imgdownload">
      <img src="/www/webpv/${details.WEBP}" class="BP_page_img" alt="${details.INTITULE}" loading="lazy"/>
      <a href="/www/pdf/Bonnes Pratiques_Partie${details.N}.pdf" download="${details.INTITULE}">Télécharger en PDF<i class="fa-solid fa-download"></i></a>
      </div>
      <span class="BP_page_description">
      <p>${details.DESCRIPTION1}</p>
      <p>${details.DESCRIPTION2}</p>
      <p>${details.DESCRIPTION3}</p>
      </span>
      <div class="BP_page_graphref">
      <span class="BP_page_ref">
      <h5>Portée par </h5>
      <p>${details.CREDIT}</p>
      <h5>Contact</h5>
      <p>${details.CONTACT}</p>
      <a href="${details.LINK}">${details.LINK}</a>
      </span>
      <div id="div_myChart" style="width: 360px; height: 200px;">
      <canvas id="myChart" width="360" height="200"></canvas>
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
      history.pushState({page: 'decouvrir'}, '', '/decouvrir');
      handleNavigation();
    });
    const newUrl = `/decouvrir/${id}`;

    // Mettez à jour l'URL dans la barre d'adresse sans recharger la page
    window.history.pushState({ path: newUrl }, '', newUrl);

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
    container.empty(); // Vider le conteneur

   console.log(displayCount);
    
    const dataToDisplay = data.slice(0, displayCount);
    dataToDisplay.forEach(item => {
      if (item.DEP && item.INTITULE) {
        const vignette = $(`
          <div class="vignette">
            <div class="details-link" tabindex="0">
              <img src="/www/webp/${item.WEBP}" alt="${item.INTITULE}" loading="lazy"/>
              <div class="BP_text">
                <h2 class="BP_title">${item.INTITULE} - ${item.TER} (${item.DEP_NOM})</h2>
                <p class="BP_caption">${item.DESCRIPTION1}</p>
              </div>
            </div>
          </div>
        `).on('click', () => {
          displayDetails(item.MOTCLES);
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

  // Fonction de filtrage des vignettes
  function filterVignettes() {
    const query = $('#search-input').val().toLowerCase();
    const strate = $('#strate-select').val();
    const depnom = $('#dep-nom-select').val();
    const thema = $('#produit-select').val();
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
    displayVignettes(filteredData);
  }

  // Attachement des événements de filtrage
  $('#search-input').on('input', filterVignettes);
  $('#search-input').on('change', filterVignettes);
  $('#strate-select').on('change', filterVignettes);
  $('#produit-select').on('change', filterVignettes);
  $('#load-more-btn').on('click', filterVignettes);
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
      var pathSegments = window.location.pathname.split('/').filter(segment => segment);
      var page = pathSegments[0] || 'accueil'; // 'accueil' si aucun segment n'est présent
  
      activateSectionAndLink(page);
  
      if (page === 'decouvrir') {
          const id = pathSegments[1]; // Supposons que l'ID est le second segment si présent
          filterVignettes();
          if (id) {
              displayDetails(id);
          }
      }
      // Gérez d'autres pages si nécessaire
  }
  

    // Écouteur pour les changements d'état de l'historique
    window.addEventListener('popstate', function(event) {
      // Gère le changement d'état ici
      if (event.state) {
        // Utilisez l'objet état de event.state pour restaurer l'état de la page
        console.log("État de page :", event.state);
        recover();
      }

      handleNavigation(); // Gère le chargement initial basé sur l'URL actuelle


  });

  function recover() {
    var detailsContainer = document.querySelector('#details-container');

    if (!detailsContainer) {
        return; // Sortie précoce si l'élément n'existe pas
    }

    // Vérifiez si l'URL contient un identifiant (id)
    var hasId = window.location.href.split('//')[1].split('/')[2]

    // Ajoutez ou enlevez la classe open basé sur la présence de l'id
    if (hasId) {
        detailsContainer.classList.add('open');
    } else {
        detailsContainer.classList.remove('open');
    }
  }

  var sc = document.getElementById('sans_collectivite');

  sc.addEventListener('click', function() {
    history.pushState({page: 'decouvrir'}, '', '/decouvrir');
    handleNavigation();
  });

  handleInitialLoad();
    
});
