document.addEventListener("DOMContentLoaded", function () {

  function handleNavigation() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const page = urlParams.get('page') || 'accueil'; // Fallback sur 'accueil' si aucun paramètre n'est donné

    // Logique pour activer la section correspondante
    activateSectionAndLink(page);
}

  // Fonction pour activer la section et le lien correspondants
  function activateSectionAndLink(page) {
    // Désactiver tous les liens et sections actifs
    $('.nav-link').removeClass('active');
    $('.main-section').removeClass('active');

    // Activer le lien correspondant
    $(`a[href="?page=${page}"]`).addClass('active');

    // Activer la section correspondante
    $('#' + page).addClass('active');
}

TH1 = function() {
    var selectize = $('#produit-select')[0].selectize;
    selectize.clear(); // Efface les sélections actuelles
  
    // Sélectionne les trois premières options réelles

    var options = Object.keys(selectize.options).slice(0, 4);
    selectize.setValue(options); // Sélectionne les trois premières options
  
    // Ajoute une option factice et la sélectionne
    var dummyOptionValue = "dummy-option"; // Assurez-vous que cette valeur soit unique et non présente dans vos options réelles
    selectize.addOption({value: dummyOptionValue, text: "Option Factice"});
    selectize.addItem(dummyOptionValue);
  
    // Simule la suppression de l'option factice avec la touche backspace
    setTimeout(function() {
      selectize.removeItem(dummyOptionValue);
      selectize.blur(); // Defocus le champ selectize pour simuler la fin de l'interaction utilisateur
  
      // Vous pouvez insérer ici d'autres appels de fonction qui doivent être exécutés après cette manipulation
    }, 100);

  };

  $('#TH1').on('click', function(e) {
     e.preventDefault();
      TH1();
      history.pushState({page: '?page=decouvrir'}, '', '?page=decouvrir');
      handleNavigation();
  });


  TH2 = function() {
    var selectize = $('#produit-select')[0].selectize;
    selectize.clear(); // Efface les sélections actuelles
  
    // Sélectionne les trois premières options réelles

    var options = Object.keys(selectize.options).slice(4, 7);
    selectize.setValue(options); // Sélectionne les trois premières options
  
    // Ajoute une option factice et la sélectionne
    var dummyOptionValue = "dummy-option"; // Assurez-vous que cette valeur soit unique et non présente dans vos options réelles
    selectize.addOption({value: dummyOptionValue, text: "Option Factice"});
    selectize.addItem(dummyOptionValue);
  
    // Simule la suppression de l'option factice avec la touche backspace
    setTimeout(function() {
      selectize.removeItem(dummyOptionValue);
      selectize.blur(); // Defocus le champ selectize pour simuler la fin de l'interaction utilisateur
  
      // Vous pouvez insérer ici d'autres appels de fonction qui doivent être exécutés après cette manipulation
    }, 100);

  };

  $('#TH2').on('click', function(e) {
      e.preventDefault();
      TH2();
            
      history.pushState({page: '?page=decouvrir'}, '', '?page=decouvrir');
      handleNavigation();
  });


  TH3 = function() {
    var selectize = $('#produit-select')[0].selectize;
    selectize.clear(); // Efface les sélections actuelles
  
    // Sélectionne les trois premières options réelles

    var options = Object.keys(selectize.options).slice(7, 12);
    selectize.setValue(options); // Sélectionne les trois premières options
  
    // Ajoute une option factice et la sélectionne
    var dummyOptionValue = "dummy-option"; // Assurez-vous que cette valeur soit unique et non présente dans vos options réelles
    selectize.addOption({value: dummyOptionValue, text: "Option Factice"});
    selectize.addItem(dummyOptionValue);
  
    // Simule la suppression de l'option factice avec la touche backspace
    setTimeout(function() {
      selectize.removeItem(dummyOptionValue);
      selectize.blur(); // Defocus le champ selectize pour simuler la fin de l'interaction utilisateur
  
      // Vous pouvez insérer ici d'autres appels de fonction qui doivent être exécutés après cette manipulation
    }, 100);

  };

  $('#TH3').on('click', function(e) {
      e.preventDefault();
      TH3();
            
      history.pushState({page: '?page=decouvrir'}, '', '?page=decouvrir');
      handleNavigation();
  });



  TH4 = function() {
    var selectize = $('#produit-select')[0].selectize;
    selectize.clear(); // Efface les sélections actuelles
  
    // Sélectionne les trois premières options réelles

    var options = Object.keys(selectize.options).slice(12, 16);
    selectize.setValue(options); // Sélectionne les trois premières options
  
    // Ajoute une option factice et la sélectionne
    var dummyOptionValue = "dummy-option"; // Assurez-vous que cette valeur soit unique et non présente dans vos options réelles
    selectize.addOption({value: dummyOptionValue, text: "Option Factice"});
    selectize.addItem(dummyOptionValue);
  
    // Simule la suppression de l'option factice avec la touche backspace
    setTimeout(function() {
      selectize.removeItem(dummyOptionValue);
      selectize.blur(); // Defocus le champ selectize pour simuler la fin de l'interaction utilisateur
  
      // Vous pouvez insérer ici d'autres appels de fonction qui doivent être exécutés après cette manipulation
    }, 100);

  };

  $('#TH4').on('click', function(e) {
      e.preventDefault();
      TH4();
            
      history.pushState({page: '?page=decouvrir'}, '', '?page=decouvrir');
      handleNavigation();
  });


  TH5 = function() {
    var selectize = $('#produit-select')[0].selectize;
    selectize.clear(); // Efface les sélections actuelles
  
    // Sélectionne les trois premières options réelles

    var options = Object.keys(selectize.options).slice(16, 24);
    selectize.setValue(options); // Sélectionne les trois premières options
  
    // Ajoute une option factice et la sélectionne
    var dummyOptionValue = "dummy-option"; // Assurez-vous que cette valeur soit unique et non présente dans vos options réelles
    selectize.addOption({value: dummyOptionValue, text: "Option Factice"});
    selectize.addItem(dummyOptionValue);
  
    // Simule la suppression de l'option factice avec la touche backspace
    setTimeout(function() {
      selectize.removeItem(dummyOptionValue);
      selectize.blur(); // Defocus le champ selectize pour simuler la fin de l'interaction utilisateur
  
      // Vous pouvez insérer ici d'autres appels de fonction qui doivent être exécutés après cette manipulation
    }, 100);

  };

  $('#TH5').on('click', function(e) {
      e.preventDefault();
      TH5();
            
      history.pushState({page: '?page=decouvrir'}, '', '?page=decouvrir');
      handleNavigation();
  });


  TH6 = function() {
    var selectize = $('#produit-select')[0].selectize;
    selectize.clear(); // Efface les sélections actuelles
  
    // Sélectionne les trois premières options réelles

    var options = Object.keys(selectize.options).slice(24, 30);
    selectize.setValue(options); // Sélectionne les trois premières options
  
    // Ajoute une option factice et la sélectionne
    var dummyOptionValue = "dummy-option"; // Assurez-vous que cette valeur soit unique et non présente dans vos options réelles
    selectize.addOption({value: dummyOptionValue, text: "Option Factice"});
    selectize.addItem(dummyOptionValue);
  
    // Simule la suppression de l'option factice avec la touche backspace
    setTimeout(function() {
      selectize.removeItem(dummyOptionValue);
      selectize.blur(); // Defocus le champ selectize pour simuler la fin de l'interaction utilisateur
  
      // Vous pouvez insérer ici d'autres appels de fonction qui doivent être exécutés après cette manipulation
    }, 100);

  };

  $('#TH6').on('click', function(e) {
      e.preventDefault();
      TH6();
            
      history.pushState({page: '?page=decouvrir'}, '', '?page=decouvrir');
      handleNavigation();
  });



  TH7 = function() {
    var selectize = $('#produit-select')[0].selectize;
    selectize.clear(); // Efface les sélections actuelles
  
    // Sélectionne les trois premières options réelles

    var options = Object.keys(selectize.options).slice(30, 35);
    selectize.setValue(options); // Sélectionne les trois premières options
  
    // Ajoute une option factice et la sélectionne
    var dummyOptionValue = "dummy-option"; // Assurez-vous que cette valeur soit unique et non présente dans vos options réelles
    selectize.addOption({value: dummyOptionValue, text: "Option Factice"});
    selectize.addItem(dummyOptionValue);
  
    // Simule la suppression de l'option factice avec la touche backspace
    setTimeout(function() {
      selectize.removeItem(dummyOptionValue);
      selectize.blur(); // Defocus le champ selectize pour simuler la fin de l'interaction utilisateur
  
      // Vous pouvez insérer ici d'autres appels de fonction qui doivent être exécutés après cette manipulation
    }, 100);

  };

  $('#TH7').on('click', function(e) {
      e.preventDefault();
      TH7();
            
      history.pushState({page: '?page=decouvrir'}, '', '?page=decouvrir');
      handleNavigation();
  });


  TH8 = function() {
    var selectize = $('#produit-select')[0].selectize;
    selectize.clear(); // Efface les sélections actuelles
  
    // Sélectionne les trois premières options réelles

    var options = Object.keys(selectize.options).slice(35, 41);
    selectize.setValue(options); // Sélectionne les trois premières options
  
    // Ajoute une option factice et la sélectionne
    var dummyOptionValue = "dummy-option"; // Assurez-vous que cette valeur soit unique et non présente dans vos options réelles
    selectize.addOption({value: dummyOptionValue, text: "Option Factice"});
    selectize.addItem(dummyOptionValue);
  
    // Simule la suppression de l'option factice avec la touche backspace
    setTimeout(function() {
      selectize.removeItem(dummyOptionValue);
      selectize.blur(); // Defocus le champ selectize pour simuler la fin de l'interaction utilisateur
  
      // Vous pouvez insérer ici d'autres appels de fonction qui doivent être exécutés après cette manipulation
    }, 100);

  };

  $('#TH8').on('click', function(e) {
      e.preventDefault();
      TH8();
            
      history.pushState({page: '?page=decouvrir'}, '', '?page=decouvrir');
      handleNavigation();
  });



  TH9 = function() {
    var selectize = $('#produit-select')[0].selectize;
    selectize.clear(); // Efface les sélections actuelles
  
    // Sélectionne les trois premières options réelles

    var options = Object.keys(selectize.options).slice(41, 44);
    selectize.setValue(options); // Sélectionne les trois premières options
  
    // Ajoute une option factice et la sélectionne
    var dummyOptionValue = "dummy-option"; // Assurez-vous que cette valeur soit unique et non présente dans vos options réelles
    selectize.addOption({value: dummyOptionValue, text: "Option Factice"});
    selectize.addItem(dummyOptionValue);
  
    // Simule la suppression de l'option factice avec la touche backspace
    setTimeout(function() {
      selectize.removeItem(dummyOptionValue);
      selectize.blur(); // Defocus le champ selectize pour simuler la fin de l'interaction utilisateur
  
      // Vous pouvez insérer ici d'autres appels de fonction qui doivent être exécutés après cette manipulation
    }, 100);

  };

  $('#TH9').on('click', function(e) {
      e.preventDefault();
      TH9();
            
      history.pushState({page: '?page=decouvrir'}, '', '?page=decouvrir');
      handleNavigation();
  });



  TH10 = function() {
    var selectize = $('#produit-select')[0].selectize;
    selectize.clear(); // Efface les sélections actuelles
  
    // Sélectionne les trois premières options réelles

    var options = Object.keys(selectize.options).slice(44, 49);
    selectize.setValue(options); // Sélectionne les trois premières options
  
    // Ajoute une option factice et la sélectionne
    var dummyOptionValue = "dummy-option"; // Assurez-vous que cette valeur soit unique et non présente dans vos options réelles
    selectize.addOption({value: dummyOptionValue, text: "Option Factice"});
    selectize.addItem(dummyOptionValue);
  
    // Simule la suppression de l'option factice avec la touche backspace
    setTimeout(function() {
      selectize.removeItem(dummyOptionValue);
      selectize.blur(); // Defocus le champ selectize pour simuler la fin de l'interaction utilisateur
  
      // Vous pouvez insérer ici d'autres appels de fonction qui doivent être exécutés après cette manipulation
    }, 100);

  };

  $('#TH10').on('click', function(e) {
      e.preventDefault();
      TH10();
            
      history.pushState({page: '?page=decouvrir'}, '', '?page=decouvrir');
      handleNavigation();
  });


  TH11 = function() {
    var selectize = $('#produit-select')[0].selectize;
    selectize.clear(); // Efface les sélections actuelles
  
    // Sélectionne les trois premières options réelles

    var options = Object.keys(selectize.options).slice(49, 53);
    selectize.setValue(options); // Sélectionne les trois premières options
  
    // Ajoute une option factice et la sélectionne
    var dummyOptionValue = "dummy-option"; // Assurez-vous que cette valeur soit unique et non présente dans vos options réelles
    selectize.addOption({value: dummyOptionValue, text: "Option Factice"});
    selectize.addItem(dummyOptionValue);
  
    // Simule la suppression de l'option factice avec la touche backspace
    setTimeout(function() {
      selectize.removeItem(dummyOptionValue);
      selectize.blur(); // Defocus le champ selectize pour simuler la fin de l'interaction utilisateur
  
      // Vous pouvez insérer ici d'autres appels de fonction qui doivent être exécutés après cette manipulation
    }, 100);

  };

  $('#TH11').on('click', function(e) {
      e.preventDefault();
      TH11();
            
      history.pushState({page: '?page=decouvrir'}, '', '?page=decouvrir');
      handleNavigation();
  });


  TH12 = function() {
    var selectize = $('#produit-select')[0].selectize;
    selectize.clear(); // Efface les sélections actuelles
  
    // Sélectionne les trois premières options réelles

    var options = Object.keys(selectize.options).slice(53, 58);
    selectize.setValue(options); // Sélectionne les trois premières options
  
    // Ajoute une option factice et la sélectionne
    var dummyOptionValue = "dummy-option"; // Assurez-vous que cette valeur soit unique et non présente dans vos options réelles
    selectize.addOption({value: dummyOptionValue, text: "Option Factice"});
    selectize.addItem(dummyOptionValue);
  
    // Simule la suppression de l'option factice avec la touche backspace
    setTimeout(function() {
      selectize.removeItem(dummyOptionValue);
      selectize.blur(); // Defocus le champ selectize pour simuler la fin de l'interaction utilisateur
  
      // Vous pouvez insérer ici d'autres appels de fonction qui doivent être exécutés après cette manipulation
    }, 100);

  };

  $('#TH12').on('click', function(e) {
      e.preventDefault();
      TH12();
            
      history.pushState({page: '?page=decouvrir'}, '', '?page=decouvrir');
      handleNavigation();
  });


  TH13 = function() {
    var selectize = $('#produit-select')[0].selectize;
    selectize.clear(); // Efface les sélections actuelles
  
    // Sélectionne les trois premières options réelles

    var options = Object.keys(selectize.options).slice(58, 61);
    selectize.setValue(options); // Sélectionne les trois premières options
  
    // Ajoute une option factice et la sélectionne
    var dummyOptionValue = "dummy-option"; // Assurez-vous que cette valeur soit unique et non présente dans vos options réelles
    selectize.addOption({value: dummyOptionValue, text: "Option Factice"});
    selectize.addItem(dummyOptionValue);
  
    // Simule la suppression de l'option factice avec la touche backspace
    setTimeout(function() {
      selectize.removeItem(dummyOptionValue);
      selectize.blur(); // Defocus le champ selectize pour simuler la fin de l'interaction utilisateur
  
      // Vous pouvez insérer ici d'autres appels de fonction qui doivent être exécutés après cette manipulation
    }, 100);

  };

  $('#TH13').on('click', function(e) {
      e.preventDefault();
      TH13();
            
      history.pushState({page: '?page=decouvrir'}, '', '?page=decouvrir');
      handleNavigation();
  });


  TH14 = function() {
    var selectize = $('#produit-select')[0].selectize;
    selectize.clear(); // Efface les sélections actuelles
  
    // Sélectionne les trois premières options réelles

    var options = Object.keys(selectize.options).slice(61, 68);
    selectize.setValue(options); // Sélectionne les trois premières options
  
    // Ajoute une option factice et la sélectionne
    var dummyOptionValue = "dummy-option"; // Assurez-vous que cette valeur soit unique et non présente dans vos options réelles
    selectize.addOption({value: dummyOptionValue, text: "Option Factice"});
    selectize.addItem(dummyOptionValue);
  
    // Simule la suppression de l'option factice avec la touche backspace
    setTimeout(function() {
      selectize.removeItem(dummyOptionValue);
      selectize.blur(); // Defocus le champ selectize pour simuler la fin de l'interaction utilisateur
  
      // Vous pouvez insérer ici d'autres appels de fonction qui doivent être exécutés après cette manipulation
    }, 100);

  };

  $('#TH14').on('click', function(e) {
      e.preventDefault();
      TH14();
            
      history.pushState({page: '?page=decouvrir'}, '', '?page=decouvrir');
      handleNavigation();
  });



  TH15 = function() {
    var selectize = $('#produit-select')[0].selectize;
    selectize.clear(); // Efface les sélections actuelles
  
    // Sélectionne les trois premières options réelles

    var options = Object.keys(selectize.options).slice(68, 70);
    selectize.setValue(options); // Sélectionne les trois premières options
  
    // Ajoute une option factice et la sélectionne
    var dummyOptionValue = "dummy-option"; // Assurez-vous que cette valeur soit unique et non présente dans vos options réelles
    selectize.addOption({value: dummyOptionValue, text: "Option Factice"});
    selectize.addItem(dummyOptionValue);
  
    // Simule la suppression de l'option factice avec la touche backspace
    setTimeout(function() {
      selectize.removeItem(dummyOptionValue);
      selectize.blur(); // Defocus le champ selectize pour simuler la fin de l'interaction utilisateur
  
      // Vous pouvez insérer ici d'autres appels de fonction qui doivent être exécutés après cette manipulation
    }, 100);

  };

  $('#TH15').on('click', function(e) {
      e.preventDefault();
      TH15();
            
      history.pushState({page: '?page=decouvrir'}, '', '?page=decouvrir');
      handleNavigation();
  });
});