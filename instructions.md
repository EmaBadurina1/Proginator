Ovo je mali tutorial kako krenut radit na projektu. Upute su za Windows, za Linux i Mac OS bi trebalo biti isto samo što se tiče naredbi u Command Prompt-u. Ako imate kakvih pitanja slobodno pitajte.

1. **Instalacija Git-a** :
   Ako već nemate Git instaliran na svom računalu, preuzmite ga i instalirajte sa [Git web stranice](https://git-scm.com/downloads).
1. **Otvorite Command Prompt (cmd)** :
   Otvorite Command Prompt na svom Windows računalu. Možete to učiniti tako da pritisnete `Windows + R`, upišete `cmd`, i pritisnete Enter.
1. **Navigirajte do direktorija gdje želite smjestiti repozitorij** :
   Upotrijebite `cd` naredbu da navigirate do direktorija gdje želite pohraniti Git repozitorij. Na primjer:

   ```bash
   cd putanja/do/željenog/direktorija
   ```

1. **Pull Git repozitorij** :
   Klonirajte ili pullajte Git repozitorij sa sljedećom naredbom:

   ```bash
   git clone https://github.com/EmaBadurina1/Proginator.git
   ```
1. **Checkoutajte na develop branch** :
   Postoje 3 glavne grane na kojima radimo: `master`, `develop` i `devdoc`. Kako bi krenuli programirati prebacite se na `develop` branch sa sljedećom naredbom:

   ```bash
   git checkout develop
   ```

1. **Inicijalizirajte Python virtualno okruženje (venv)** :
   Python `venv` je samo folder u kojem se čuvaju svi dodatno instalirani moduli (npr. Flask framework) koji su potrebni za pokretanje backenda. Taj folder zna biti dosta velik pa nije prikladan za spremanje na git/Github (bitno je da ga se stavi u .gitignore), tako da ćete ga trebati sami inicijalizirati i dopuniti sa modulima.
   Unutar direktorija repozitorija, inicijalizirajte Python virtualno okruženje koristeći sljedeću naredbu:

   ```bash
   python -m venv venv
   ```

1. **Aktivirajte Python virtualno okruženje** :
   Svaki put kad mislite pokrenuti backend (ili išta programirati na njemu) morate aktivirati venv.
   Aktivirajte virtualno okruženje pomoću sljedeće naredbe:

   ```bash
   venv\Scripts\activate
   ```

   Nakon što ga aktivirate, trebali biste vidjeti da se u Command Prompt-u ispred svake naredbe pojavi ime virtualnog okruženja u zagradama, na primjer: 
   `(.venv) C:\Users\username\Documents\GitHub\Proginator>`


1. **Instalirajte module iz requirements.txt datoteke** :
   U requirements.txt datoteci nalaze se svi moduli koje je potrebno instalirati, kasnije ćemo možda trebati dodati još modula pa će biti potrebno opet pokrenuti ovu komandu.
   U virtualnom okruženju instalirajte module iz requirements.txt datoteke koristeći pip:

   ```bash
   pip install -r requirements.txt
   ```

1. **Izgradite node_modules folder za React** :
   React isto zahtijeva dodatne module koji se spremaju u node_modules, isto kao i python venv taj folder je prevelik pa ga trebate sami instalirati, no kod Reacta je to puno lakse. 
   Navigirajte do direktorija gdje je spremljen react (izvorniKod/frontend):
   ```bash
   cd izvorniKod/frontend
   ```
   i zatim završite sljedeću naredbu:

   ```bash
   npm install
   ```
Ovako bi trebala izgledati struktura direktorija nakon što ste završili sve korake:
```bash
├───.venv                         <--- virtualno okruženje
├───izvorniKod
│   ├───backend
│   │   └───app.py
│   └───frontend
│       ├───node_modules          <--- React moduli
│       ├───public
│       ├───src
│       ├───.gitignore
│       ├───package-lock.json
│       ├───package.json
│       └───README.md
├───.gitignore
├───dnevnik.txt
├───instructions.md
├───instructions.pdf
├───requirements.txt
└───Zadatak.pdf
```

Sretno s radom! :D