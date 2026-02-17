const users = {};

const respondJSON = (request, response, status, object) => {
  const body = JSON.stringify(object);
  response.writeHead(status, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body),
  });

  if (request.method !== 'HEAD') {
    response.write(body);
  }
  response.end();
};

const respondNoContent = (response) => {
  response.writeHead(204);
  response.end();
};

const getUsers = (request, response) => {
  respondJSON(request, response, 200, { users });
};

const notFound = (request, response) => {
  respondJSON(request, response, 404, {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  });
};

const addUser = (request, response, body) => {
  const name = body.name;
  const age = body.age;

  if (!name && !age) {
    return respondJSON(request, response, 400, {
      message: 'Name and age are required.',
      id: 'missingParams',
    });
  }
  if (!name) {
    return respondJSON(request, response, 400, {
      message: 'Name is required.',
      id: 'missingName',
    });
  }
  if (!age) {
    return respondJSON(request, response, 400, {
      message: 'Age is required.',
      id: 'missingAge',
    });
  }

  const ageNum = Number(age);
  if (Number.isNaN(ageNum)) {
    return respondJSON(request, response, 400, {
      message: 'Age must be a number.',
      id: 'invalidAge',
    });
  }

  const exists = !!users[name];
  users[name] = { name, age: ageNum };

  if (!exists) {
    return respondJSON(request, response, 201, {
      message: 'Created Successfully',
      id: 'created',
    });
  }

  // existing user updated -> 204 no body
  return respondNoContent(response);
};

module.exports = {
  getUsers,
  notFound,
  addUser,
};
