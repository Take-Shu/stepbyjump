if (typeof prefersReducedMotion === 'function') {

  if (!prefersReducedMotion()) {
    const elements = ['.p-services__img', '.p-about__text-container', '.p-works__article'];

    elements.forEach(element => {
      gsap.from(element, {
        duration: 1.5,
        y: 100,
        opacity: 0,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: element,
          start: 'top bottom',
        },
      });
    });
    
    gsap.from('.p-recruit__item', {
      duration: 1.5,
      y: 100,
      opacity: 0,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.p-recruit__item',
        start: 'top bottom',
      },
      stagger: {
        from: 'start',
        amount: 0.8
      }
    });
  }
} else {
  console.error("function 'prefersReducedMotion' not defined")
}