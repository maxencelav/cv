import './style.css'
import dataFR from './metadata_fr.json';
import dataEN from './metadata_en.json';
import display from './metadata_display.json';

import locationSvg from '@fluentui/svg-icons/icons/location_20_regular.svg?raw';
import mailSvg from '@fluentui/svg-icons/icons/mail_20_regular.svg?raw';
import callSvg from '@fluentui/svg-icons/icons/call_20_regular.svg?raw';
import globeSvg from '@fluentui/svg-icons/icons/globe_20_regular.svg?raw';
import linkSvg from '@fluentui/svg-icons/icons/link_20_regular.svg?raw';

const ICONS = {
  location: locationSvg,
  mail: mailSvg,
  call: callSvg,
  globe: globeSvg,
  link: linkSvg
};

function icon(name) {
  return `<span class="icon icon-${name}">${ICONS[name]}</span>`;
}

/** Loads an optional custom stylesheet from /custom-styles/<name>.css, selected via the ?style= URL param. Disables the original styles. */
function loadCustomStyle() {
  const name = new URLSearchParams(window.location.search).get('style');
  if (!name || !/^[a-zA-Z0-9_-]+$/.test(name)) return;

  document.querySelectorAll('link[rel="stylesheet"], style').forEach(el => { el.disabled = true; });

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `${import.meta.env.BASE_URL}custom-styles/${name}.css`;
  document.head.appendChild(link);

  
}

const stripProtocol = (url) => url.replace(/(^\w+:|^)\/\//, '').replace(/\/$/, '');
const lastSegment = (url) => stripProtocol(url).split('/').filter(Boolean).pop();

/** Returns true if the item with the given id should be shown (defaults to true if not configured). */
function isShown(section, id) {
  return display[section]?.[id]?.show !== false;
}

/** Returns true if a highlight within a job should be shown (defaults to true if not configured). */
function isHighlightShown(jobId, highlightId) {
  return display.experiences?.[jobId]?.highlights?.[highlightId] !== false;
}

function makeContactItem(inner) {
  const li = document.createElement('li');
  li.innerHTML = inner;
  return li;
}

function renderBasics(root, basics, profile) {
  root.querySelector('.basics-name').innerText = basics.name;
  root.querySelector('.basics-role').innerText = basics.role;
  root.querySelector('.profile').innerHTML = profile;

  const contact = root.querySelector('.basics-contact');
  contact.replaceChildren(
    makeContactItem(`${icon('location')} <span>${basics.location}</span>`),
    makeContactItem(`${icon('mail')} <a href="mailto:${basics.email}">${basics.email}</a>`),
    makeContactItem(`${icon('call')} <a href="tel:${basics.phone.replace(/\s+/g, '')}">${basics.phone}</a>`),
    makeContactItem(`${icon('globe')} <a href="${basics.website}">${stripProtocol(basics.website)}</a>`),
    makeContactItem(`<span class="icon"><img src="${import.meta.env.BASE_URL}GitHub_Invertocat_White.svg" alt="GitHub"></span> <a href="${basics.github}">${lastSegment(basics.github)}</a>`),
    makeContactItem(`<span class="icon"><img src="${import.meta.env.BASE_URL}InBug-White.png" alt="LinkedIn"></span> <a href="${basics.linkedin}">${lastSegment(basics.linkedin)}</a>`)
  );
}

function renderExperiences(container, experiences) {
  container.replaceChildren();
  experiences
    .filter(exp => isShown('experiences', exp.id))
    .forEach(exp => {
      const item = document.createElement('div');
      item.classList.add('item');

      const company = document.createElement('h3');
      company.classList.add('company');
      company.innerText = exp.company;
      item.appendChild(company);

      if (exp.position) {
        const position = document.createElement('p');
        position.classList.add('position');
        position.innerText = exp.position;
        item.appendChild(position);
      }

      if (exp.date) {
        const date = document.createElement('p');
        date.classList.add('date');
        date.innerText = exp.date;
        item.appendChild(date);
      }

      const visibleHighlights = exp.highlights.filter(h => isHighlightShown(exp.id, h.id));
      const summary = document.createElement('div');
      summary.classList.add('summary');
      const ul = document.createElement('ul');
      visibleHighlights.forEach(h => {
        const li = document.createElement('li');
        li.innerHTML = h.text;
        ul.appendChild(li);
      });
      summary.appendChild(ul);
      item.appendChild(summary);

      appendUrls(item, exp.url, true);

      container.appendChild(item);
    });
}

function makeUrl(url) {
  const a = document.createElement('a');
  a.classList.add('url');
  a.innerHTML = `${icon('link')} ${stripProtocol(url)}`;
  a.href = url;
  a.target = '_blank';
  return a;
}

function appendUrls(container, url, wrap = false) {
  if (!url) return;
  const urls = (Array.isArray(url) ? url : [url]).map(makeUrl);

  if (!wrap) {
    urls.forEach(u => container.appendChild(u));
    return;
  }

  const links = document.createElement('div');
  links.classList.add('links');
  urls.forEach(u => links.appendChild(u));
  container.appendChild(links);
}

// Generic renderer for education / projects / languages / interests
function renderItems(container, items, section) {
  container.replaceChildren();
  items
    .filter(item => typeof item === 'string' || !item.id || isShown(section, item.id))
    .forEach(item => {
      if (typeof item === 'string') {
        const span = document.createElement('span');
        span.classList.add('item');
        span.innerText = item;
        container.appendChild(span);
        return;
      }

      // Interests use {id, text} shape
      if (item.text && !item.name && !item.institution) {
        const span = document.createElement('span');
        span.classList.add('item');
        span.innerText = item.text;
        container.appendChild(span);
        return;
      }

      const el = document.createElement('div');
      el.classList.add('item');

      const addLine = (tag, cls, text, html = false) => {
        const node = document.createElement(tag);
        node.classList.add(cls);
        if (html) node.innerHTML = text; else node.innerText = text;
        el.appendChild(node);
      };

      if (item.name) addLine('h3', 'name', item.name);
      if (item.institution) addLine('h3', 'institution', item.institution);
      if (item.issuer) addLine('p', 'issuer', item.issuer);
      if (item.title) addLine('p', 'title', item.title);
      if (item.description) addLine('p', 'description', item.description);
      if (item.date) addLine('p', 'date', item.date);
      if (item.summary) addLine('p', 'summary', item.summary, true);
      appendUrls(el, item.url);

      container.appendChild(el);
    });
}

function renderPage(lang, data) {
  const root = document.querySelector(`.page[lang=${lang}]`);
  if (!root) return;

  renderBasics(root, data.basics, data.profile);
  renderExperiences(root.querySelector('.experiences'), data.experiences);
  renderItems(root.querySelector('.education'), data.education, 'education');
  renderItems(root.querySelector('.projects'), data.projects, 'projects');
  renderItems(root.querySelector('.languages'), data.languages, 'languages');
  renderItems(root.querySelector('.interests'), data.interests, 'interests');
}

window.addEventListener('DOMContentLoaded', () => {
  renderPage('fr', dataFR);
  renderPage('en', dataEN);
  loadCustomStyle();
});

