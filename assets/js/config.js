window.SNORQL_CONFIG = {
    endpoint: "https://aopwiki.rdf.bigcat-bioinformatics.org/sparql",
    examplesRepo: "https://github.com/marvinm2/AOP-Wiki-Queries",
    defaultGraph: "",
    title: "AOP-Wiki RDF Explorer",
    poweredByLink: "https://aopwiki.org",
    poweredByLabel: "AOP-Wiki",
    showLiteralType: false,
    renderers: {
        enableSVGRenderer: false,
        enableSMILESRenderer: true
    },
    // Optional navbar linkout buttons, rendered in array order by linkouts.js.
    // Keep the live default EMPTY so existing deployments render unchanged.
    // Each entry: { label, url, authors?, icon? }
    //   label   - button text (shown as plain text; HTML is escaped)
    //   url     - http/https/mailto only; other schemes (javascript:/data:) are rejected
    //   authors - optional; used as the accessible name (aria-label/title) when present
    //   icon    - optional Bootstrap-3 glyphicon suffix, e.g. "book" -> glyphicon-book
    //             (allowlisted to [a-z0-9-]; invalid suffixes are dropped)
    // SECURITY: this array is untrusted input — do not remove the escaping or
    // the URL scheme allowlist in assets/js/linkouts.js. See FORK.md.
    // Example:
    //   linkouts: [
    //     { label: "Tutorial", url: "https://example.org/tutorial", icon: "book" },
    //     { label: "Credits",  url: "https://example.org/about", authors: "Jane Doe et al." }
    //   ],
    linkouts: [
        { label: "Dashboard", url: "https://aopwiki-dashboard.vhp4safety.nl", icon: "stats" },
        { label: "Schema", url: "https://github.com/marvinm2/AOPWikiRDF/blob/master/docs/schema.md", icon: "book" }
    ],
    namespaces: {
        // Standard RDF prefixes
        rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
        rdfs: "http://www.w3.org/2000/01/rdf-schema#",
        owl: "http://www.w3.org/2002/07/owl#",
        xsd: "http://www.w3.org/2001/XMLSchema#",
        dc: "http://purl.org/dc/elements/1.1/",
        dcterms: "http://purl.org/dc/terms/",
        foaf: "http://xmlns.com/foaf/0.1/",

        // AOP-Wiki specific prefixes
        aop: "https://identifiers.org/aop/",
        "aop.events": "https://identifiers.org/aop.events/",
        "aop.relationships": "https://identifiers.org/aop.relationships/",
        "aop.stressor": "https://identifiers.org/aop.stressor/",
        aopo: "http://aopkb.org/aop_ontology#",

        // Chemical identifiers
        cas: "https://identifiers.org/cas/",
        chebi: "https://identifiers.org/chebi/",
        inchikey: "https://identifiers.org/inchikey/",
        "chembl.compound": "https://identifiers.org/chembl.compound/",
        "pubchem.compound": "https://identifiers.org/pubchem.compound/",
        drugbank: "https://identifiers.org/drugbank/",
        "kegg.compound": "https://identifiers.org/kegg.compound/",
        lipidmaps: "https://identifiers.org/lipidmaps/",
        hmdb: "https://identifiers.org/hmdb/",
        chemspider: "https://identifiers.org/chemspider/",

        // Biological ontologies
        go: "http://purl.obolibrary.org/obo/GO_",
        pato: "http://purl.obolibrary.org/obo/PATO_",
        cl: "http://purl.obolibrary.org/obo/CL_",
        uberon: "http://purl.obolibrary.org/obo/UBERON_",
        hp: "http://purl.obolibrary.org/obo/HP_",
        mp: "http://purl.obolibrary.org/obo/MP_",
        mi: "http://purl.obolibrary.org/obo/MI_",
        pco: "http://purl.obolibrary.org/obo/PCO_",
        nbo: "http://purl.obolibrary.org/obo/NBO_",
        vt: "http://purl.obolibrary.org/obo/VT_",
        pr: "http://purl.obolibrary.org/obo/PR_",
        chebio: "http://purl.obolibrary.org/obo/CHEBI_",
        mmo: "http://purl.obolibrary.org/obo/MMO_",

        // Gene and protein identifiers
        hgnc: "https://identifiers.org/hgnc/",
        ncbigene: "https://identifiers.org/ncbigene/",
        uniprot: "https://identifiers.org/uniprot/",
        ensembl: "https://identifiers.org/ensembl/",

        // Taxonomic and reference
        ncbitaxon: "http://purl.bioontology.org/ontology/NCBITAXON/",
        wikidata: "https://identifiers.org/wikidata/",

        // Other ontologies and vocabularies
        fma: "http://purl.org/sig/ont/fma/fma",
        cheminf: "http://semanticscience.org/resource/CHEMINF_",
        ncit: "http://ncicb.nci.nih.gov/xml/owl/EVS/Thesaurus.owl#",
        comptox: "https://comptox.epa.gov/dashboard/",
        edam: "http://edamontology.org/",

        // Metadata and provenance
        "void": "http://rdfs.org/ns/void#",
        pav: "http://purl.org/pav/",
        dcat: "http://www.w3.org/ns/dcat#",

        // Wikidata prefixes
        wd: "http://www.wikidata.org/entity/",
        wds: "http://www.wikidata.org/entity/statement/",
        wdv: "http://www.wikidata.org/value/",
        wdt: "http://www.wikidata.org/prop/direct/",
        wikibase: "http://wikiba.se/ontology#",
        p: "http://www.wikidata.org/prop/",
        ps: "http://www.wikidata.org/prop/statement/",
        pq: "http://www.wikidata.org/prop/qualifier/",
        bd: "http://www.bigdata.com/rdf#"
    },
    autocompleteTypes: {
        aop: {
            sparql: 'PREFIX aopo: <http://aopkb.org/aop_ontology#>\n' +
                'PREFIX dc: <http://purl.org/dc/elements/1.1/>\n' +
                'PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>\n' +
                'SELECT DISTINCT (REPLACE(STR(?aop), "^.*/aop/", "") AS ?id) (str(?title) as ?name)\n' +
                'WHERE { ?aop a aopo:AdverseOutcomePathway ; dc:title ?title . }\n' +
                'ORDER BY xsd:integer(?id)',
            valueField: 'id',
            labelField: 'name',
            placeholder: 'Type AOP ID or title...'
        },
        keyEvent: {
            sparql: 'PREFIX aopo: <http://aopkb.org/aop_ontology#>\n' +
                'PREFIX dc: <http://purl.org/dc/elements/1.1/>\n' +
                'PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>\n' +
                'SELECT DISTINCT (REPLACE(STR(?ke), "^.*/aop.events/", "") AS ?id) (str(?title) as ?name)\n' +
                'WHERE { ?ke a aopo:KeyEvent ; dc:title ?title . }\n' +
                'ORDER BY xsd:integer(?id)',
            valueField: 'id',
            labelField: 'name',
            placeholder: 'Type Key Event ID or title...'
        },
        stressor: {
            sparql: 'PREFIX nci: <http://ncicb.nci.nih.gov/xml/owl/EVS/Thesaurus.owl#>\n' +
                'PREFIX dc: <http://purl.org/dc/elements/1.1/>\n' +
                'PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>\n' +
                'SELECT DISTINCT (REPLACE(STR(?s), "^.*/aop.stressor/", "") AS ?id) (str(?title) as ?name)\n' +
                'WHERE { ?s a nci:C54571 ; dc:title ?title . }\n' +
                'ORDER BY xsd:integer(?id)',
            valueField: 'id',
            labelField: 'name',
            placeholder: 'Type stressor ID or name...'
        },
        chemical: {
            // value is the CAS registry number (a string with hyphens, e.g. 100-42-5)
            sparql: 'PREFIX cheminf: <http://semanticscience.org/resource/CHEMINF_>\n' +
                'PREFIX dc: <http://purl.org/dc/elements/1.1/>\n' +
                'SELECT DISTINCT (str(?casid) AS ?id) (str(?title) as ?name)\n' +
                'WHERE { ?cas a cheminf:000000 ; dc:title ?title ; cheminf:000446 ?casid . }\n' +
                'ORDER BY ?title',
            valueField: 'id',
            labelField: 'name',
            placeholder: 'Type CAS number or chemical name...'
        },
        taxon: {
            // NCBI taxa carry several synonym titles per id; concatenate them all
            // so the field is searchable by latin name, common name, or taxon id.
            sparql: 'PREFIX ncbitaxon: <http://purl.bioontology.org/ontology/NCBITAXON/>\n' +
                'PREFIX dc: <http://purl.org/dc/elements/1.1/>\n' +
                'PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>\n' +
                'SELECT (REPLACE(STR(?taxon), "^.*/NCBITAXON/", "") AS ?id) (GROUP_CONCAT(DISTINCT str(?title); separator=" / ") AS ?name)\n' +
                'WHERE { ?taxon a ncbitaxon:131567 ; dc:title ?title . }\n' +
                'GROUP BY ?taxon\n' +
                'ORDER BY xsd:integer(REPLACE(STR(?taxon), "^.*/NCBITAXON/", ""))',
            valueField: 'id',
            labelField: 'name',
            placeholder: 'Type NCBI taxon ID, latin or common name...'
        }
    },
    welcomeTitle: "AOP-Wiki RDF Explorer",
    welcomeMessage: "<p>Browse and run SPARQL queries against the AOP-Wiki RDF endpoint.</p><ul><li><strong>Browse examples</strong> in the tree on the right — queries are organised by Adverse Outcome Pathways, Key Events, Key Event Relationships, Stressors, and federated queries</li><li><strong>Edit parameters</strong> to customise queries for your AOP, KE, or stressor of interest</li><li><strong>Write your own SPARQL</strong> directly in the editor below — namespace prefixes for the AOP ontology and identifier services are pre-loaded</li></ul>"
};
