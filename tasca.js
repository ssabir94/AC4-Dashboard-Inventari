// Dades inicials
let productes = [
    { id: 1, nom: "Portàtil Pro", categoria: "Electrònica", preu: 950, stock: 4 },
    { id: 2, nom: "Camiseta cotó", categoria: "Roba", preu: 18, stock: 25 },
    { id: 3, nom: "Auriculars", categoria: "Electrònica", preu: 45, stock: 0 },
    { id: 4, nom: "Llibre JS Avançat", categoria: "Llibres", preu: 32, stock: 12 }
];

let estatOrdenacio = { columna: null, ascendent: true };

// --- RENDERITZACIÓ DE LA TAULA I METRIQUES ---
function actualitzarDashboard() {
    mostrarProductes(productes);
    actualitzarMetriques();
}

function mostrarProductes(llista) {
    const tbody = document.getElementById("taula-productes");
    tbody.innerHTML = "";

    llista.forEach(prod => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
      <td>${prod.id}</td>
      <td><strong>${prod.nom}</strong></td>
      <td>${prod.categoria}</td>
      <td>${prod.preu.toFixed(2)} €</td>
      <td>${prod.stock}</td>
      <td>
        <button class="btn btn-sm btn-edit" onclick="carregarPerEditar(${prod.id})">Editar</button>
        <button class="btn btn-sm btn-delete" onclick="eliminarProducte(${prod.id})">Eliminar</button>
      </td>
    `;
        tbody.appendChild(tr);
    });
}


// --- TASCA 1: MÈTRIQUES DEL DASHBOARD (reduce, at, some, every) ---
function actualitzarMetriques() {
    // DONE 1.1: Utilitza 'reduce' per calcular el valor total (preu * stock)
    // L'acumulador comença a 0 i hi afegim el preu multiplicat pel stock.
    const total = productes.reduce((acc,producte) => {
        return acc + (producte.preu *producte.stock);
    }, 0);
    // acc-> Total q portem acumulat. / producte-> Objecte que estem processant en volta
    // return acc + -> Retorna nou acumulador per volta seguent
    // 0 -> valor inicial acumulador.  total-> Rep resultat final de reduce()

    document.getElementById("val-total").innerText = `${total.toFixed(2)} €`;
    // Mostrem el total amb dos decimals a la targeta de l'HTML.


    // DONE 1.2: Utilitza el mètode 'at(-1)' per obtenir l'últim producte afegit a l'array
    // L'índex -1 permet accedir al final sense calcular la longitud.
    const ultim = productes.at(-1);

    // Si existeix un últim producte, mostrem el seu nom.
    // Si l'array està buit, mostrem un guió.
    document.getElementById("val-ultim").innerText = ultim ? ultim.nom : "-";
    // ultim conté l’objecte sencer, no només el nom. Per això fem servir ultim.nom per mostrar-lo.


    // DONE 1.3: Utilitza 'some' per comprovar si hi ha cap producte sense stock (stock === 0)
    const téSenseStock = productes.some(producte => producte.stock === 0);
    // some() retorna un booleà: true o false.

    // Mostrem un avís si hi ha algun producte sense existències.
    document.getElementById("val-sense-stock").innerText = téSenseStock ? "⚠️ Manca stock" : "✅ Ok";

    // DONE 1.4: Utilitza 'every' per comprovar si tots els preus són superiors a 0
    // every() retorna false tan bon punt troba un preu que no compleix la condició.
    const totsValids = productes.every(producte => producte.preu > 0 );

    // Mostrem si tots els preus compleixen la condició.
    document.getElementById("val-preu-valid").innerText = totsValids ? "✅ Correcte" : "❌ Error";
}


// --- TASCA 2: AFEGIR I EDITAR PRODUCTES (push, with, map i Math.max) ---
document.getElementById("form-producte").addEventListener("submit", (e) => {
    e.preventDefault();

    const editId = document.getElementById("edit-id").value;
    const dadesForm = {
        nom: document.getElementById("nom").value,
        categoria: document.getElementById("categoria").value,
        preu: parseFloat(document.getElementById("preu").value),
        stock: parseInt(document.getElementById("stock").value)
    };

    if (editId) {
        // EDITAR PRODUCTE EXISTENT
        const idNum = parseInt(editId);

        // DONE 2.3: Troba l'índex del producte amb 'findIndex'
        // Busquem la posició del producte que té aquesta ID.
        // findIndex() retorna -1 si no el troba.
        const index = productes.findIndex(p => p.id === idNum );

        if (index !== -1) {
            // Conservem la ID i incorporem les dades actualitzades del formulari.
            const producteEditat = { id: idNum, ...dadesForm };
            // DONE 2.3: Actualitza l'array 'productes' utilitzant el mètode immutable 'with' (ES2023)
            // with() crea un nou array amb el producte substituït en aquesta posició.
            // Reassignem productes perquè apunti al nou array.
            productes = productes.with(index, producteEditat);
        }
    } else {
        // CREAR NOU PRODUCTE
        // DONE 2.1: Calcula la nova ID trobant la màxima actual amb 'map' i 'Math.max' (si no hi ha productes, usa 0)
        const maxId = productes.length > 0 ? Math.max(...productes.map(p => p.id)) : 0;
        // map() crea un array amb les IDs i ... les passa a Math.max().
        // Si no hi ha productes, prenem 0 com a valor de partida.
        const nouProducte = { id: maxId + 1, ...dadesForm };
        // Creem el producte amb la següent ID i les dades del formulari.


        // DONE 2.2: Afegeix 'nouProducte' a l'array 'productes' amb 'push'
        // ESCRIU EL TEU CODI AQUÍ
        productes.push(nouProducte);
    }

    netejarFormulari();
    actualitzarDashboard();
});


// --- TASCA 3: ELIMINAR DE MANERA IMMUTABLE (findIndex i toSpliced) ---
function eliminarProducte(id) {
    // DONE 3.1: Troba l'índex del producte amb 'findIndex'
    // Busquem la posició del producte amb aquesta ID.
    const index = productes.findIndex(p => p.id === id);

    // Només eliminem si hem trobat el producte.
    if (index !== -1) {
        // DONE 3.2: Reemplaça l'array 'productes' per un de nou sense el producte eliminat fent servir 'toSpliced' (ES2023)
        // Creem un nou array eliminant un element des de la posició trobada.
        productes = productes.toSpliced(index, 1);

        // Actualitzem la taula i les mètriques.
        actualitzarDashboard();
    }
}


// --- TASCA 4: CERCA AVANÇADA DEL DARRER ELEMENT (findLast) ---
document.getElementById("btn-cerca-last").addEventListener("click", () => {
    const cat = document.getElementById("cerca-cat-last").value;

    // DONE 4.1: Utilitza 'findLast' per trobar el darrer producte que pertanyi a la categoria 'cat'
    // Busquem des del final l'últim producte de la categoria seleccionada.
    // Si no hi ha cap coincidència, findLast() retorna undefined.
    const ultimCat = productes.findLast(p => p.categoria === cat );

    if (ultimCat) {
        alert(`Darrer producte trobat de ${cat}: ${ultimCat.nom} (${ultimCat.preu}€)`);
    } else {
        alert(`No hi ha cap producte de la categoria ${cat}`);
    }
});


// --- TASCA 5: ORDENACIÓ PER COLUMNA (toSorted i toReversed) ---
document.querySelectorAll(".sortable").forEach(th => {
    th.addEventListener("click", () => {
        const columna = th.dataset.sort;

        if (estatOrdenacio.columna === columna) {
            estatOrdenacio.ascendent = !estatOrdenacio.ascendent;
        } else {
            estatOrdenacio.columna = columna;
            estatOrdenacio.ascendent = true;
        }

        // DONE 5.1: Utilitza 'toSorted' (ES2023) per obtenir un array ordenat segons la columna (nom, preu o stock)
        let llistaOrdenada = productes.toSorted((a, b) => {
            if (columna === "nom"){
                // Comparem els noms per ordenar-los alfabèticament.
                return a.nom.localeCompare(b.nom);
            }

            // Per a preu i stock, comparem els valors numèrics.
            return a[columna] - b[columna];
        });

        // DONE 5.2: Si 'estatOrdenacio.ascendent' és fals, inverteix la llista utilitzant 'toReversed' (ES2023)
        if (!estatOrdenacio.ascendent) {
        llistaOrdenada = llistaOrdenada.toReversed();
        } // Si toca ordre descendent, invertim la còpia ordenada.

        mostrarProductes(llistaOrdenada);
    });
});


// --- TASCA 6: CERCA I FILTRES COMBINATS (filter i includes) ---
document.getElementById("input-cerca").addEventListener("input", aplicarFiltres);
document.getElementById("filtre-categoria").addEventListener("change", aplicarFiltres);

function aplicarFiltres() {
    const text = document.getElementById("input-cerca").value.toLowerCase();
    const cat = document.getElementById("filtre-categoria").value;

    // DONE 6.1: Utilitza 'filter' i el mètode 'includes' per filtrar els productes per nom i/o categoria
    const filtrats = productes.filter(p => {
        //filter() recorre els productes i conserva els que retornen true. Retorna un array nou sense modificar productes.
        // Passem el nom a minúscules per comparar sense distingir majúscules.
        const coincideixNom = p.nom.toLowerCase().includes(text);

        // "Totes" permet qualsevol categoria.
        const coincideixCategoria = cat === "Totes" || p.categoria === cat;

        // El producte només passa el filtre si compleix les dues condicions.
        return coincideixNom && coincideixCategoria;
    });

    mostrarProductes(filtrats);
}


// --- FUNCIONS AUXILIARS D'EDICIÓ I FORMULARI ---
function carregarPerEditar(id) {
    const prod = productes.find(p => p.id === id);
    if (!prod) return;

    document.getElementById("edit-id").value = prod.id;
    document.getElementById("nom").value = prod.nom;
    document.getElementById("categoria").value = prod.categoria;
    document.getElementById("preu").value = prod.preu;
    document.getElementById("stock").value = prod.stock;

    document.getElementById("form-title").innerText = "✏️ Editar Producte";
    document.getElementById("btn-submit").innerText = "Actualitzar (with)";
    document.getElementById("btn-cancel").style.display = "block";
}

document.getElementById("btn-cancel").addEventListener("click", netejarFormulari);

function netejarFormulari() {
    document.getElementById("form-producte").reset();
    document.getElementById("edit-id").value = "";
    document.getElementById("form-title").innerText = "➕ Afegir Producte";
    document.getElementById("btn-submit").innerText = "Guardar (push / with)";
    document.getElementById("btn-cancel").style.display = "none";
}

// Inicialització
actualitzarDashboard();