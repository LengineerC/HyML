import { CurseForgeClient, CurseForgeGameEnum } from "curseforge-api";

const client=new CurseForgeClient("$2a$10$r1ke/cJO/j1wilEEDXa2OuN.MdlohVbwQgXka.Y9a2zMkWS40zudS",{
  fetch: window.fetch.bind(window)
});

export const getMinecraftVersions=async ()=>{
  const response=await client.getMinecraftVersions();

  const versionList=response.map(item=>({
    id:item.id,
    gameVersionId:item.gameVersionId,
    versionString:item.versionString,
    dateModified:item.dateModified,
  }));

  return versionList;
}