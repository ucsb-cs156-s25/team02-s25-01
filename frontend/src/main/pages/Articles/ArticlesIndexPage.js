// import React from "react";
// import { useBackend } from "main/utils/useBackend";

// import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
// import ArticleTable from "main/components/Articles/ArticleTable";
// import { useCurrentUser, hasRole } from "main/utils/currentUser";
// import { Button } from "react-bootstrap";

// export default function ArticleIndexPage() {
//   const currentUser = useCurrentUser();

//   const {
//     data: articles,
//     error: _error,
//     status: _status,
//   } = useBackend(
//     // Stryker disable next-line all : don't test internal caching of React Query
//     ["/api/articles/all"],
//     { method: "GET", url: "/api/articles/all" },
//     // Stryker disable next-line all : don't test default value of empty list
//     [],
//   );

//   const createButton = () => {
//     if (hasRole(currentUser, "ROLE_ADMIN")) {
//       return (
//         <Button
//           variant="primary"
//           href="/articles/create"
//           style={{ float: "right" }}
//         >
//           Create Article
//         </Button>
//       );
//     }
//   };

//   return (
//     <BasicLayout>
//       <div className="pt-2">
//         {createButton()}
//         <h1>Articles</h1>
//         <ArticleTable articles={articles} currentUser={currentUser} />
//       </div>
//     </BasicLayout>
//   );
// }
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";

export default function ArticlesIndexPage() {
  // Stryker disable all : placeholder for future implementation
  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Index page not yet implemented</h1>
        <p>
          <a href="/articles/create">Create</a>
        </p>
        <p>
          <a href="/articles/edit/1">Edit</a>
        </p>
      </div>
    </BasicLayout>
  );
}