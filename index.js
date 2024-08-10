import { gsap, random } from 'gsap';

import { ScrollTrigger } from 'gsap/ScrollTrigger';

/* The following plugin is a Club GSAP perk */
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

import barba from '@barba/core';

const navlinks = document.querySelectorAll('.navbar_link');

function init() {
  gsap.to('.loader_box', {
    opacity: 0,
    duration: 0.0001,
    stagger: { amount: 0.5, from: 'random' },
  });
  handleNavState();

  barba.init({
    transitions: [
      {
        leave(data) {
          return gsap.to('.loader_box', {
            opacity: 1,
            duration: 0.0001,
            stagger: { amount: 0.5, from: 'random' },
          });
        },
        enter(data) {
          data.current.container.remove();
          return gsap.to('.loader_box', {
            opacity: 0,
            duration: 0.0001,
            stagger: { amount: 0.5, from: 'random' },
          });
        },
      },
    ],
    views: [
      {
        namespace: 'home',
        beforeEnter(data) {
          clientQuoteAni();
          handleNavState();
        },
      },
      {
        namespace: 'about',
        beforeEnter(data) {
          clientQuoteAni();
          handleNavState();
        },
      },
      {
        namespace: 'posts',
        beforeEnter(data) {
          handleNavState();
        },
        afterEnter(data) {
          const pageID = data.next.container.getAttribute('data-wf-page');
          restartWebflow(pageID);
        },
      },
      {
        namespace: 'posts-cms',
        beforeEnter(data) {
          handleNavState();
        },
      },
    ],
  });

  function handleNavState() {
    navlinks.forEach((link) => {
      link.classList.remove('active');
    });

    const path = window.location.pathname;
    const activeLink = document.querySelector(`a[href="${path}"]`);
    activeLink.classList.add('active');
  }

  function restartWebflow(pageID) {
    if (!pageID) {
      console.error('No page ID found.');
      return;
    }
    console.log(pageID);
    document.querySelector('html').setAttribute('data-wf-page', pageID);

    // Reinitialize webflow modules
    Webflow.destroy();
    Webflow.ready();
    Webflow.require('ix2').init();
  }

  function clientQuoteAni() {
    ScrollTrigger.create({
      trigger: '#client-quote',
      start: 'top 80%',
      markers: true,
      onEnter: () => {
        var split = new SplitText('#client-quote', { type: 'chars' });
        //now animate each character into place from 100px above, fading in:
        gsap.from(split.chars, {
          duration: 0.1,
          y: 100,
          autoAlpha: 0,
          stagger: 0.05,
        });
      },
    });
  }
}

window.addEventListener('DOMContentLoaded', init);
