export const displayName = (data) => {
  const { firstName, middleInitial, lastName } = data
  return Object.values({ firstName, lastName, middleInitial })
    .filter((val) => val && val.length)
    .join(' ')
}

export const displayDegree = (data) =>
  data.degree && data.degree.length ? ', ' + data.degree : ''

export const displayNameAndDegree = (data) =>
  displayName(data) + displayDegree(data)
