# Example with Spotify Web API

1. Modify [./templates.yaml](./templates.yaml) as per your needs
1. Render requests: `diglett render examples/spotify/templates.yaml -d -n 3 > requests.jsonl`
1. Get an [access token](https://developer.spotify.com/documentation/general/guides/authorization-guide/) to [Spotify Web API](https://developer.spotify.com/documentation/web-api/)
1. Export access token as shell variable: `export ACCESS_TOKEN=YOUR_SPOTIFY_ACCESS_TOKEN`
1. Send requests: `diglett send examples/spotify/requests.jsonl -H 'Authorization: Bearer '"${ACCESS_TOKEN}"''`
