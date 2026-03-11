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
    }
};
