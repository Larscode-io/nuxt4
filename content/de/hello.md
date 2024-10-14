---
title: Catch-All-Seite für Markdown-Inhalte
year: 2024
---

### Catch-All-Seite für Markdown-Inhalte

Die Catch-All-Seite in unserer Nuxt-Anwendung ist darauf ausgelegt, Markdown-Inhalte dynamisch basierend auf dem URL-Pfad zu rendern. Unter Verwendung der `[...slug].vue`-Datei erfasst diese Seite alle Routen, die nicht mit spezifischeren Pfaden übereinstimmen, und ermöglicht so eine flexible Inhaltsverwaltung.

#### Hauptmerkmale:

- **Dynamisches Routing**: Die Catch-All-Seite passt zu jeder verschachtelten Route und ermöglicht das nahtlose Hinzufügen neuer Markdown-Dateien ohne individuelle Routendefinitionen.

- **Markdown-Rendering**: Sie nutzt Nuxt Content, um Markdown-Inhalte abzurufen und anzuzeigen, die in den Verzeichnissen `content/nl, content/fr,...` gespeichert sind.

- **SEO-freundlich**: Durch die Generierung sauberer URLs, die der Struktur der Inhaltsdateien entsprechen, verbessert dieses Setup die Suchmaschinenoptimierung.

- **Flexible Struktur**: Der Markdown-Inhalt kann verschiedene Elemente wie Überschriften, Absätze, Bilder und benutzerdefinierte Komponenten enthalten und bietet so ein reichhaltiges Benutzererlebnis.

#### Beispielverwendung:

[Code snippet remains unchanged]

### Wie man den Legacy Nuxt 2 Content Loader verwendet
Die [Legacy Content Loader](/de/legacyContent) Seite dient als Brücke zwischen unserer neuen Nuxt 3-Anwendung und dem Inhalt unserer alten Nuxt 2-Website (www.const-court.be). Diese Seite ist darauf ausgelegt, Markdown (.md) Dateien direkt aus der Inhaltsstruktur der alten Website zu laden und darzustellen. Durch die Implementierung dieses Ansatzes können wir bestehende Inhalte während des Migrationsprozesses nahtlos integrieren und sicherstellen, dass wertvolle Informationen zugänglich bleiben, während wir zum neuen Nuxt 3-Framework übergehen. Diese Methode ermöglicht es uns, Inhalte im Laufe der Zeit schrittweise zu verschieben und dabei die Konsistenz in der Informationsarchitektur und Benutzererfahrung unserer Website während der gesamten Migration aufrechtzuerhalten.
