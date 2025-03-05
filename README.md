
# Discord voice stats bot - 🇵🇱 (Ostatni update 25.11.2023)

#### **Informacje ogólne**

Bot zbiera statystyki użytkowników z kanałów głosowych. Zbierane statystyki to: 

- Spędzony Czas Online ⏳
- Czas spędzony dziś ⌚️
- Czas Przestreamowany 🎥
- Ostatnio Online. 📅

Możesz dostosować działanie bota, edytując plik `config.json`

## Konfiguracja

Aby dostosować działanie bota, edytuj plik `config.json` Poniżej znajduje się przykładowa konfiguracja:

```json
{
	"messageChannel": "id_kanału_wiadomosci",
	"afkChannel": "id_kanału_afk",
	"showLimit_1": 10,
	"showLimit_2": 10,
	"showLimit_3": 10,
	"messages": {
		"COOLDOWN_MESSAGE": "Musisz poczekać `<duration>`!"
	},
	"sqlite": true
}
```

Możesz wybrać pomiędzy bazą danych SQLite oraz MySQL ustawiając odpowiednio opcję sqlite
- True = SQLite
- False = MySQL

`afkChannel` - Ustaw ID kanału afk lub kanału na którym nie mają być zbierane statystyki jeśli potrzebujesz

`showLimit_1, 2, 3` - odpowiadają za limit wyświetlanych statystyk. [zobacz](#1)

## Zmienne .env

Aby korzystać z bota, musisz uzupełnić plik `.env` następującymi informacjami:

```env
TOKEN=        #TOKEN BOTA
CLIENT_ID=    #ID BOTA
GUILD_ID=     #ID SERWERA
OWNER_ID=     #ID WŁAŚCICIELA LUB INNEJ OSOBY
```

Oraz konfiguracja MySQL (jeśli dotyczy)

```env
MYSQL_HOSTNAME=
MYSQL_USERNAME=
MYSQL_PASSWORD=
MYSQL_DATABASE=
```

> [!NOTE]
> Jeśli ustawisz `OWNER_ID` wtedy tylko ty bądź określony użytkownik będzie mógł korzystać z pewnych poleceń. W przeciwnym razie każda osoba z uprawnieniami `ADMINISTRATOR` będzie mogła je wykonać.

## Komendy

Bot posiada 4 główne komendy
- `/statystyki` - wyświetl swoje lub czyjeś statystyki
- `/stats dodaj` - dodaj konkretną osobę do bazy danych
- `/stats usun` - usuń konkretna osobę z bazy danych
- `/stats dodaj_wszystkich` - dodaj wszystkie osoby na serwerze do bazy danych 

Komendy z grupy `/stats` są osiągalne dla `OWNER_ID` (jeśli ustawiono) lub osób z uprawnieniami `ADMINISTRATOR`

## Screenshoty<a id='1'></a>

Wyświetlanie statystyk na kanale `messageChannel` ustawionym w pliku `config.json`

![Image_0](https://content.vfox.pl/png/ftmv00.png)

Wyświetlanie statystyk za pomocą komendy `/statystyki`

![Image_1](https://content.vfox.pl/png/iZyLMa.png)
