/**
 * 将maven坐标转换为普通路径
 * @param {string} mavenCoordinate - maven坐标
 * @returns {string} - 转换后的路径
 */
const mavenToPath=mavenCoordinate=>{
  const parts = mavenCoordinate.split(':');
    
  if (parts.length !== 3) {
      throw new Error('Invalid Maven coordinate format');
  }

  const groupId = parts[0].replace(/\./g, '/');
  const artifactId = parts[1];
  const version = parts[2];
  
  return `${groupId}/${artifactId}/${version}/${artifactId}-${version}.jar`;
}

module.exports={
  mavenToPath,
}