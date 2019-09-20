import {NgModule} from '@angular/core';
import {ApolloModule, APOLLO_OPTIONS} from 'apollo-angular';
import {HttpLinkModule, HttpLink} from 'apollo-angular-link-http';
import {InMemoryCache} from 'apollo-cache-inmemory';
import { HttpHeaders } from '@angular/common/http';


let healders=  new HttpHeaders({
    "Authorization":localStorage.getItem("tokenAuth")?localStorage.getItem("tokenAuth"):""
})

@NgModule({
  exports: [ApolloModule, HttpLinkModule],
  providers: [
    {
        provide: APOLLO_OPTIONS,
        useFactory: (httpLink: HttpLink) => {
          return {
            cache: new InMemoryCache(),
            link: httpLink.create({
              uri: "http://localhost:8000/graphql",
              headers:healders
            })
          }
        },
        deps: [HttpLink]
      }
  ],
})

export class GraphQLModule {}