/**
 * linkouts.js - config-driven navbar linkout buttons.
 *
 * A deployer defines an ordered `linkouts` array on window.SNORQL_CONFIG. Each
 * entry: { label, url, authors?, icon? }. This module sanitises every field and
 * renders Bootstrap-3 navbar <li><a> buttons into #navbar-linkouts.
 *
 * SECURITY / TRUST BOUNDARY: the linkouts config is UNTRUSTED input. It travels
 * through git, mounted files, and potentially third-party PRs, then is rendered
 * into the navbar DOM. Therefore:
 *   - label/authors are written via textContent only (never innerHTML)
 *   - url schemes are allowlisted to http/https/mailto (defeats javascript:/data:)
 *   - icon suffixes are allowlisted to [a-z0-9-] before composing a glyphicon class
 *   - every anchor carries rel="noopener noreferrer" (reverse-tabnabbing guard)
 * Do NOT "simplify" these away.
 *
 * Self-contained: no module system; vendored-globals style. The escape helper is
 * inlined (a verbatim copy of snorql.js's escapeHtml) rather than imported, to
 * avoid load-order coupling and to keep the module unit-testable in isolation.
 */
(function () {
    'use strict';

    var SAFE_SCHEMES = ['http:', 'https:', 'mailto:'];
    var ICON_SUFFIX = /^[a-z0-9-]+$/;

    // Verbatim copy of snorql.js escapeHtml (createTextNode -> innerHTML).
    // innerHTML here is a READ of escaped text, never a write of config values.
    function escapeLinkoutText(str) {
        var div = document.createElement('div');
        div.appendChild(document.createTextNode(String(str == null ? '' : str)));
        return div.innerHTML;
    }

    function sanitizeLinkoutUrl(raw) {
        if (typeof raw !== 'string' || raw.trim() === '') return null;
        try {
            var base = (typeof window !== 'undefined' && window.location)
                ? window.location.href
                : 'http://localhost/';
            var u = new URL(raw, base);
            return SAFE_SCHEMES.indexOf(u.protocol) !== -1 ? u.href : null;
        } catch (e) {
            return null;
        }
    }

    function buildLinkoutNode(entry) {
        if (!entry || typeof entry !== 'object') return null;

        var href = sanitizeLinkoutUrl(entry.url);
        if (href === null) return null;

        var li = document.createElement('li');
        var a = document.createElement('a');

        a.setAttribute('href', href);
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener noreferrer');

        // Optional glyphicon: allowlist the suffix, compose the class on a child
        // span. Never inject raw entry.icon into a class or via innerHTML.
        if (typeof entry.icon === 'string' && ICON_SUFFIX.test(entry.icon)) {
            var icon = document.createElement('span');
            icon.className = 'glyphicon glyphicon-' + entry.icon;
            icon.setAttribute('aria-hidden', 'true');
            a.appendChild(icon);
            a.appendChild(document.createTextNode(' '));
        }

        // Label is untrusted text — textContent only, never innerHTML.
        a.appendChild(document.createTextNode(String(entry.label == null ? '' : entry.label)));

        // Accessible name for icon-only buttons; authors override label.
        var name = String(
            (entry.authors != null && entry.authors !== '') ? entry.authors :
            (entry.label != null ? entry.label : '')
        );
        if (name !== '') {
            a.setAttribute('title', name);
            a.setAttribute('aria-label', name);
        }

        li.appendChild(a);
        return li;
    }

    function renderLinkouts(config, mountEl) {
        if (!config || !Array.isArray(config.linkouts) || config.linkouts.length === 0) return;
        if (!mountEl) return;
        for (var i = 0; i < config.linkouts.length; i++) {
            var node = buildLinkoutNode(config.linkouts[i]);
            if (node) mountEl.appendChild(node);
        }
    }

    // Expose helpers to the vm sandbox (used by __tests__/linkouts.test.js) and,
    // in a browser, to window for debugging.
    var Linkouts = {
        escapeLinkoutText: escapeLinkoutText,
        sanitizeLinkoutUrl: sanitizeLinkoutUrl,
        buildLinkoutNode: buildLinkoutNode,
        renderLinkouts: renderLinkouts
    };
    // `this` is the sandbox/global the IIFE is invoked against (see .call() below),
    // letting __tests__/linkouts.test.js pull `Linkouts` off the vm sandbox.
    this.Linkouts = Linkouts;

    // Self-init in the browser. Guard the DOMContentLoaded race (Pitfall 4): if
    // the document already finished parsing, render immediately; otherwise wait.
    if (typeof window !== 'undefined' && typeof document !== 'undefined' && document.addEventListener) {
        window.renderLinkouts = renderLinkouts;
        var init = function () {
            renderLinkouts(window.SNORQL_CONFIG, document.getElementById('navbar-linkouts'));
        };
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
        } else {
            init();
        }
    }
}).call(typeof globalThis !== 'undefined' ? globalThis : this);
