import { useEffect, useState } from 'react'
import { set } from 'date-fns';

export function useWindowScrollTop() {
  // Initialize state with undefined scroll so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [top, setTop] = useState(undefined)

  useEffect(() => {
    // only execute all the code below in client side
    if (typeof window !== 'undefined') {
      // Handler to call on window scroll
      function handleScroll() {
        if (window.pageYOffset === 0) {
          setTop(true)
        }
        setTop(undefined)
      }

      // Add event listener
      window.addEventListener("scroll", handleScroll);


      // Call handler right away so state gets updated with initial window scroll
      handleScroll();

      // Remove event listener on cleanup
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, []); // Empty array ensures that effect is only run on mount
  return top;
}