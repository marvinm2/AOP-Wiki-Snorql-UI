# AOP-Wiki RDF Explorer: the Snorql UI engine (wikipathways/Snorql-UI) plus this
# instance's config, theme and images. Engine updates are a tag bump here
# (Dependabot opens a PR when a new engine minor version is published).
FROM ghcr.io/wikipathways/snorql-ui:1.2

COPY config.js /usr/local/apache2/htdocs/assets/js/config.js
COPY theme.css /usr/local/apache2/htdocs/assets/css/theme.css
COPY images/ /usr/local/apache2/htdocs/assets/images/
