library(httr)
library(jsonlite)

# Définissez le chemin vers votre fichier JSON de service_account.
json_key_file <- "phrasal-chiller-414914-69972bfd1520.json"

# Lisez le fichier de service_account.
service_account_info <- fromJSON(txt = file(json_key_file))

# Préparez le jeton d'accès en utilisant la bibliothèque httr.
scope <- "https://www.googleapis.com/auth/indexing"
credentials <- oauth_service_token(
  endpoint = oauth_endpoints("google"),
  secrets = service_account_info,
  scope = scope
)

# URL de l'API d'indexation Google.
endpoint <- "https://indexing.googleapis.com/v3/urlNotifications:publish"

# Fonction pour soumettre une URL à l'API d'indexation.
index_url <- function(url, token) {
  # Assurez-vous que le contenu est bien un objet JSON et non une liste
  content <- toJSON(list(url = url, type = "URL_UPDATED"), auto_unbox = TRUE)
  response <- POST(
    url = endpoint,
    add_headers(Authorization = sprintf("Bearer %s", token$credentials$access_token), `Content-Type` = "application/json"),
    body = content,
    encode = "json"
  )
  if (status_code(response) == 200) {
    return(content(response))
  } else {
    return(paste("Error:", status_code(response), content(response)))
  }
}

# Liste des URLs à indexer.
urls <- c(
  'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=bus-probleme-psy',
  'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=ateliers-ecritures',
  'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=olympiade-sport-senior',
  'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=vestiaire-solidaire',
  'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=mutuelle-communale',
  'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=aide-aux-transports-scolaires',
  'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=le-bus-mobil-sante',
  'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=permanence-juridique',
  'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=fiche-info-secours',
  'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=marchons-dans-nos-campagnes',
  'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=cheques-vacances',
  'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=espaces-sans-tabac',
  'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=atelier-memoire',
  'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=emballage-violentometre',
  'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=collecte-contre-la-precarite-hygienique',
  'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=aide-aux-devoirs-gratuite',
  'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=bafa-contre-benevolat',
  'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=projet-art',
  'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=tarifs-differencies-et-degressifs-pour-les-parkings',
  'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=les-jardins-partages',
  'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=conseil-pour-les-droits-et-devoirs-des-familles-(cddf)',
  'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=informations-application-numerique',
  'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=une-ecole-dans-un-ehpad',
  'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=ambassadeur-ecologie-ecole',
  'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=recyclage-stade-materiaux',
  'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=ateliers-virtuels-contre-l-isolement',
  'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=reunion-mort-cimetiere',
  'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=moustique',
  'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=scenario-ski',
  'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=commune-vote-en-ligne',
  'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=eau-public',
  'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=formation-deces-reunion-elus',
  'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=bons-alimentaires',
  'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=alimentaire',
  'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=presque-zero-dechet',
  'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=lampadaires',
  'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=grainotheque',
  'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=camping-base-de-loisirs',
  'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=studio-enregistrement',
  'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=bourse-permis',
  'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=velos',
  'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=secretaires',
  'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=employe-municipal',
  'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=protection-sociale',
  'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=binã´me-21',
  'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=nutrition',
  'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=signaletique',
  'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=internes',
  'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=atelier-du-19',
  'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=guide-handicap',
  'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=quiquoiquesse',
  'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=mal-etre',
  'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=tarification-sociale',
  'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=ccas-fiche-operation',
  'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=josephine',
  'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=referentiel',
  'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=trouble-memoire-bistrot',
  'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=pack-domotique',
  'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=point-jeunes-seniors',
  'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=audiocite',
  'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=cantine',
  'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=sciences-comportementales',
  'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=vegetalisation',
  'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=ecoquartier',
  'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=patrimoine',
  'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=boutique',
  'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=hackaton',
  'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=stand',
  'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=alimentation',
  'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=microepargne',
  'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=bus-senior-numerique',
  'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=jardins',
  'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=paroles',
  'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=voisins-solidaires',
  'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=espace-parentalite',
  'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=accueil',
  'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=produits-chimiques',
  'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=autosuffisance',
  'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=hydrogene',
  'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=quartiers-propres',
  'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=green-saturday',
  'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=tri-ecologie-dechet',
  'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=mutinerie-village',
  'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=reseau-de-chaleur',
  'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=cantine-scolaire',
  'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=autonomie-energie',
  'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=charte',
  'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=eclairage',
  'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=friches',
  'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=composteurs',
  'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=musee',
  'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=sport',
  'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=trotinette',
  'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=bouteille-reutilisation',
  'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=budget',
  'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=chauffeur-bus',
  'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=fluorescente',
  'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=carto-party',
  'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=tribunal',
  'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=evaluation'
  
  
)
# Bouclez sur les URLs et indexez-les.
for (url in urls) {
  response_content <- index_url(url, credentials)
  print(paste("URL:", url))
  print(paste("Response:", response_content))
  Sys.sleep(0.1) # Exemple : attendre 1 seconde entre chaque requête
}
