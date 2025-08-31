
// Header scroll effect + dark toggle
(function(){
  const header = document.querySelector('.header');
  const thToggle = document.getElementById('theme-toggle');
  const root = document.documentElement;

  function onScroll(){
    if(window.scrollY > 8){ header.classList.add('is-scrolled'); }
    else{ header.classList.remove('is-scrolled'); }
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive:true });

  if(thToggle){
    thToggle.addEventListener('click', ()=>{
      const isDark = root.classList.toggle('dark');
      localStorage.setItem('theme', isDark ? 'dark':'light');
    });
    const saved = localStorage.getItem('theme');
    if(saved === 'dark'){ root.classList.add('dark'); }
  }
})();
