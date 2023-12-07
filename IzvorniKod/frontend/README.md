Frontend part of the project

Every page and component has its own CSS file so it is easier to maintain the
look of the page.

The whole pages go into src/pages and components go into src/components folder

If you are creating component/page your commit should be 2 files inside
components/pages folders, one for {component/page}.js and one for
{components/page}.css

The final structure after commit should look like this
src
   components
      {component}.js
      {component}.css
   pages
      {page}.js
      {page}.css

If you create the whole page you should also add your route (path) inside
src/index.js file under: "const router = createBrowserRouter([...]);"

Here are some usefull website for React development:

   https://mui.com/ - MUI, the React component library
   
   https://react.dev/ - React, documentation for React and ReactDOM
   
   https://reactrouter.com/ - React Router, documentation for React Router
   

We are using React@18 and React Router@6

Be careful not to ask ChatGPT for help with React Router@6 because last
information that he has is of React Router@5 so you won't find an answer
by asking him. Instead use the link above for documentation as there are
a ton of explanations about a lot of your questions you might have and
it is very clear with examples and tutorials about most of them. React
Router@6 is very different from version before so be careful about note
above but there should be no issues with asking ChatGPT for React@18 and
ReactDOM@18 as your questions will probably be covered with previous and
the new version of React.
