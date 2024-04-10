from oauth2client.service_account import ServiceAccountCredentials
import httplib2
import json

SCOPES = ["https://www.googleapis.com/auth/indexing"]
ENDPOINT = "https://indexing.googleapis.com/v3/urlNotifications:publish"
JSON_KEY_FILE = "phrasal-chiller-414914-f71474aed209.json"

# Vérifiez que vous avez le fichier JSON correct pour les informations d'identification du compte de service.
credentials = ServiceAccountCredentials.from_json_keyfile_name(JSON_KEY_FILE, scopes=SCOPES)
http = credentials.authorize(httplib2.Http())

def index_url(url):
    content = json.dumps({
        "url": url,
        "type": "URL_UPDATED"
    })

    response, content = http.request(ENDPOINT, method="POST", body=content)
    return response, json.loads(content)

# Liste des URLs à indexer.
'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=habitat-participatif',
'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=mangeoires',
'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=chaleur',
'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=coloc-seniors',
'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=marche-ccas',
'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=kit-nouveaux',
'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=interactive',
'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=fabrique',
'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=cineseine',
'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=agenda',
'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=bons-plans',
'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=minibox',
'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=miaulants',
'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=librairie',
'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=citad-elles',
'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=femmes',
'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=femmes-hommes',
'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=harcelement',
'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=referents',
'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=dispositifs',
'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=foyer',
'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=alimentaire',
'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=nouveaux-actifs',
'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=alimentaire',
'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=cafe-creation',
'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=economie-circulaire',
'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=campus-rural',
'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=bistrot-pradeau',
'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=reconquete-agricole',
'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=rest-o',
'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=entreprendre',
'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=insertion',
'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=hub-enerco',
'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=locaux',
'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=carte-fidelite',
'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=tiers-lieu',
'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=creches',
'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=etudes',
'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=parcours-de-vie',
'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=kolocations',
'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=mediation',
'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=etudiants',
'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=kfe',
'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=pump-track',
'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=radio-sommieres',
'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=cafes-itinerants',
'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=autofinancee',
'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=randonnee',
'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=opticien',
'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=covoiturage',
'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=village-jardin',
'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=cantine',
'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=portage',
'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=permacole',
'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=mobilite',
'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=navette',
'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=co-voiturage',
'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=pain-communal',
'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=collaboratif',
'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=autodefense',
'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=magazine',
'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=pain-communal',
'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=cody',
'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=biodiviersite',
'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=algorithmes',
'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=non-concurrentielles',
'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=biodechets',
'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=cyber',
'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=vacant',
'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=ecotourisme',
'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=faitout',
'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=intergenerationnel',
'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=bistrot',
'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=administrative',
'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=arrosage',
'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=insertion',
'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=ecole',
'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=eclairage',
'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=odd',
'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=maji',
'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=drive',
'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=debats',
'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=art',
'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=hirondelles',
'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=brigade',
'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=cimetiere',
'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=medecine',
'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=numerique',
'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=eclairage',
'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=anti-dechets',
'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=saisonnier',
'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=handibox',
'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=commande-publique',
'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=relogement',
'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=ruralite',
'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=revitalisation',
'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=passerelle',
'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=defi-climatique',
'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=alimentaire',
'https://bonnes-pratiques.ithea-conseil.fr/?page=decouvrir&id=commission'
]

# Boucle sur la liste des URLs et les indexe une par une.
for url in urls:
    response, content = index_url(url)
    print(f"URL: {url}")
    print(f"Response: {response}")
    print(f"Content: {content}")
    # Ajouter un délai si nécessaire pour éviter d'atteindre les limites de quota.
