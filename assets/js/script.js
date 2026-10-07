
(function ($) {

function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
        return navigator.clipboard.writeText(text);
    }
    // Fallback for non-secure contexts (HTTP deployments)
    var textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    return Promise.resolve();
}

jQuery(document).ready(function() {

        jQuery("#query-button").on("click",function(event){
            event.preventDefault();

            var query = editor.getDoc().getValue();
            var queryText = getPrefixes() + query;

            var queryEncoded = "?q="+encodeURIComponent(query)+"&endpoint="+encodeURIComponent(jQuery("#endpoint").val().trim());
            var url = window.location.href.split('?')[0] + queryEncoded;

            window.history.replaceState(null, "", url);

            doQuery(jQuery("#endpoint").val(), query, function(json) { displayResult(json, "SPARQL results"); });

		});

		jQuery("#fetch").on("click",function(){
            fetchExamples();
            fetchExamples("-fs");
		});

		// Logo resets to a clean page, dropping the long ?q=... permalink URL.
		jQuery("#index-page").on("click",function(event){
            event.preventDefault();
            window.location.href = window.location.pathname;
		});

        //---------------- Populate query from URL (if available) -----------------------

        var query = findGetParameter("q");
        if(query != null){
            editor.getDoc().setValue(query);
        }

        //----------------  END OF Populate query from URL (if available) -----------------------

		//---------------- Search funcionality starts ------------------------

        var search = function(e) {
          var pattern = $('#input-search').val();
          if (pattern) {
              searchExamples(pattern, '');
          }
        }

        $('#btn-search').on('click', search);

        $('#btn-clear-search').on('click', function (e) {
          $('#input-search').val('');
          // Restore full tree
          if (typeof _fullTreeData !== 'undefined' && _fullTreeData) {
              initTreeview(JSON.parse(JSON.stringify(_fullTreeData)), '');
          }
        });

        //---------------- Search funcionality ends ------------------------

        //---------------- Search funcionality Fullscreen starts ------------------------

        var searchfs = function(e) {
          var pattern = $('#input-search-fs').val();
          if (pattern) {
              searchExamples(pattern, '-fs');
          }
        }

        $('#btn-search-fs').on('click', searchfs);

        $('#btn-clear-search-fs').on('click', function (e) {
          $('#input-search-fs').val('');
          // Restore full tree
          if (typeof _fullTreeData !== 'undefined' && _fullTreeData) {
              initTreeview(JSON.parse(JSON.stringify(_fullTreeData)), '-fs');
          }
        });

        //---------------- Search funcionality Fullscreen ends ------------------------

        jQuery("#copy-button").on("click", function() {
            var query = editor.getDoc().getValue();
            var $btn = $(this);
            var originalHtml = $btn.html();

            copyToClipboard(query).then(function() {
                $btn.html('<i class="glyphicon glyphicon-ok"></i> Copied!');
                setTimeout(function() {
                    $btn.html(originalHtml);
                }, 1500);
            });
        });

		jQuery("#reset-button").on("click", function() {
            // Clear template state
            _paramMode = false;
            _currentTemplate = null;
            _currentParams = null;
            _currentParsedTitle = null;
            // Clear editor (wrapped in ignore flag to prevent dim trigger)
            _paramIgnoreChange = true;
            editor.getDoc().setValue("");
            _paramIgnoreChange = false;
            // Show welcome panel (per D-09, D-19)
            showWelcomePanel();
        });

        jQuery("#export-csv").on("click",function(e){
            e.preventDefault();
            var query = editor.getDoc().getValue();
            exportResults(jQuery("#endpoint").val(), query, "csv");
        });

        jQuery("#export-tsv").on("click",function(e){
            e.preventDefault();
            var query = editor.getDoc().getValue();
            exportResults(jQuery("#endpoint").val(), query, "tsv");
        });

        jQuery("#export-json").on("click",function(e){
            e.preventDefault();
            var query = editor.getDoc().getValue();
            exportResults(jQuery("#endpoint").val(), query, "json");
        });

        jQuery("#export-xml").on("click",function(e){
            e.preventDefault();
            var query = editor.getDoc().getValue();
            exportResults(jQuery("#endpoint").val(), query, "xml");
        });

        jQuery("#enter-fullscreen").on("click",function(){
            document.getElementById("fullscreen-navbar").style.display="block";
            document.getElementById("footer").style.display="none";
            editor.setOption("fullScreen", !editor.getOption("fullScreen"));
        });

        jQuery("#exit-fullscreen").on("click",function(){
            document.getElementById("fullscreen-navbar").style.display="none";
            document.getElementById("footer").style.display="block";
            if (editor.getOption("fullScreen")) editor.setOption("fullScreen", false);
        });

        jQuery("#examples-fullscreen").on("click",function(){
            $('#examplesModal').modal();
        });

        jQuery("#show-prefixes").on("click",function(event){
            event.preventDefault();
            prefixesUrl = jQuery("#endpoint").val().replace(/\/$/, "")+"?help=nsdecl";

            fetch(prefixesUrl)
                .then((response) => response.text())
                .then((html) => {
                    document.getElementById("prefixesModalBody").innerHTML = $(html).find('#help > table').prop('outerHTML');
                })
                .catch((error) => {
                    document.getElementById("prefixesModalBody").innerHTML = "<h4>Could not obtain prefix information. This functionality works with Virtuoso-based SPARQL endpoints only.</h4>";
                });

            $('#prefixesModal').modal().find('#prefixesModalBody');
        });

        jQuery("#generate-permalink").on("click",function(e){

            e.preventDefault();

            // The permalink is the page URL itself (?q=...&endpoint=...), which the
            // page already reads on load. No external shortener: a shortener needs a
            // token in client code and fails on long queries.
            var query = editor.getDoc().getValue().trim();
            var url = window.location.href.split('?')[0] +
                "?q=" + encodeURIComponent(query) +
                "&endpoint=" + encodeURIComponent(jQuery("#endpoint").val().trim());

            $('#permalink-input').val(url);
            $('#permalink-open').attr('href', url);
            $('#permalink-copied').hide();
            // Apache's default request-line limit is 8190 bytes; longer links are
            // refused with 414 when opened.
            $('#permalink-warning').toggle(url.length > 8000);
            $('#permalinkModal').modal();
        });

        jQuery("#permalink-copy").on("click",function(){
            var url = $('#permalink-input').val();
            var done = function(){ $('#permalink-copied').show(); };
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(url).then(done);
            } else {
                $('#permalink-input').trigger('select');
                if (document.execCommand('copy')) { done(); }
            }
        });
    });
})(jQuery);
