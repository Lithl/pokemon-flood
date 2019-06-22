(() => {
  const toc = document.getElementById('toc');
  const headings = [...document.querySelectorAll('h2,h3')]
      .slice(1);
  let lastLi;

  for (let i = 0; i < headings.length; i++) {
    const hn = headings[i];
    const anchor = hn.innerText.toLowerCase().replace(/[^a-z]+/g, '-');

    const li = document.createElement('li');
    const a = document.createElement('a');
    li.appendChild(a);
    a.innerText = hn.innerText;

    hn.setAttribute('id', anchor);
    a.setAttribute('href', `#${anchor}`);
    if (hn.nodeName === 'H3') {
      let ul = lastLi.querySelector('ul');
      if (!ul) {
        ul = document.createElement('ul');
        lastLi.appendChild(ul);
      }
      ul.appendChild(li);
    } else {
      lastLi = li;
      toc.appendChild(li);
    }
  }
})();
