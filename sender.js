import { Octokit } from "https://cdn.skypack.dev/@octokit/core";

function sendit(sendtitle, sendbody){
    (async () => {
      const octokit = new Octokit({ auth: "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" }); // you shouldnt hardcode this but its private so its ok
      async function start() {
        try {
          return await octokit.request('POST /repos/skparab1/snake/issues', {
              owner: 'skparab1',
              repo: 'snake',
              title: sendtitle,
              body: sendbody,
              tags: 'serverdata'
            })
        } catch(error) {
          // whatever ig it just doesnt get sent
        }
      };
      
      start();
    })();
  }