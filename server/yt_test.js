fetch('https://www.youtube.com/results?search_query=shape+of+you')
  .then(res => res.text())
  .then(html => {
    const match = html.match(/"videoId":"([a-zA-Z0-9_-]{11})"/);
    if (match) {
      console.log('FOUND VIDEO ID:', match[1]);
      console.log('URL: https://www.youtube.com/watch?v=' + match[1]);
    } else {
      console.log('NO MATCH');
    }
  })
  .catch(console.error);
