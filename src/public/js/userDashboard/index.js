const socket = io();

const addOrUpdateProductRow = (data) => {
  console.log('documents:', data);
  /*   const user = data.user; */
  const documents = data.documents; 

  const productRows = documents.map(
    (document) => `
  <tr id='${document.id}'>
    <td>${document.id}</td>
    <td>${document.name}</td>
    <td>${document.reference}</td>
    <td>${document.fieldname}</td>
    <td>
      <button class='btn btn-danger btn-sm' onclick="deleteDocument('${document.id}')">Eliminar</button>
    </td>
  </tr>
`
  );

  const productRowsHTML = productRows.join('');

  const productTable = document.getElementById('product-table');

  const existingRow = document.getElementById(documents[0]._id); 

  if (existingRow) {
    existingRow.innerHTML = productRowsHTML;
  } else {
    productTable.insertAdjacentHTML('beforeend', productRowsHTML);
  }
};

const deleteDocumentRow = (documentId) => {
  const documentRow = document.getElementById(documentId);
  if (documentRow) {
    documentRow.remove();
  }
};

socket.on('newDocument', addOrUpdateProductRow);
socket.on('deleteDocument', deleteDocumentRow);

const addOrUpdateStatusRow = (data) => {
  console.log('statusData', data);
  const documents_status = data.user.documents_status;
  const premium_documents_status = data.user.premium_documents_status;

  const statusTable = document.getElementById('status-table');

  const statusRows = [
    `
    <thead>
      <tr>
        <th>Document</th>
        <th>Status</th>
      </tr>
    </thead>
    `,
    `
    <tr>
      <td>Any document</td>
      <td>${documents_status}</td>
    </tr>
    `,
    `
    <tr>
      <td>Premium documents</td>
      <td>${premium_documents_status}</td>
    </tr>
    `,
  ];

  const statusRowsHTML = statusRows.join('');

  statusTable.innerHTML = statusRowsHTML;
};

socket.on('newStatus', addOrUpdateStatusRow);

const userIdDiv = document.getElementById('userId');

const userId = userIdDiv.getAttribute('data-user-id');

console.log('cartIdDiv', userId);

const deleteDocument = (id) => {
  console.log(id);
  fetch(`/api/users/${userId}/documents/${id}`, {
    method: 'DELETE',
  })
    .then((response) => {
      if (response.ok) {
        socket.emit('deleteDocument', id);
      } else {
        console.error('Error al eliminar el producto');
      }
    })
    .catch((error) => {
      console.error('Error al eliminar el producto:', error);
    });
};

document.addEventListener('DOMContentLoaded', () => {
  const productForm = document.getElementById('documentFormIdentification');
  productForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(productForm);

    // Mostrar los datos antes de enviar el formulario
    for (const entry of formData.entries()) {
      const [name, value] = entry;
      console.log(`name: ${name}, value: ${value}`);
    }

    const response = await fetch(` /api/users/${userId}/documents/identificacion`, {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      console.log('Documento agregado con éxito');
      productForm.reset();
      /*       window.location.reload(); */
    } else {
      const error = await response.json();
      console.error('Error al agregar el documento:', error);
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const productForm = document.getElementById('documentFormProofOfAddress');
  productForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(productForm);

    // Mostrar los datos antes de enviar el formulario
    for (const entry of formData.entries()) {
      const [name, value] = entry;
      console.log(`name: ${name}, value: ${value}`);
    }

    const response = await fetch(` /api/users/${userId}/documents/comprobanteDeDomicilio`, {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      console.log('Documento agregado con éxito');
      productForm.reset();
      /*       window.location.reload(); */
    } else {
      const error = await response.json();
      console.error('Error al agregar el documento:', error);
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const productForm = document.getElementById('documentFormBankStatement');
  productForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(productForm);

    // Mostrar los datos antes de enviar el formulario
    for (const entry of formData.entries()) {
      const [name, value] = entry;
      console.log(`name: ${name}, value: ${value}`);
    }

    const response = await fetch(` /api/users/${userId}/documents/comprobanteDeEstadoDeCuenta`, {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      console.log('Documento agregado con éxito');
      productForm.reset();
      /*       window.location.reload(); */
    } else {
      const error = await response.json();
      console.error('Error al agregar el documento:', error);
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const productForm = document.getElementById('document');
  productForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(productForm);

    // Mostrar los datos antes de enviar el formulario
    for (const entry of formData.entries()) {
      const [name, value] = entry;
      console.log(`name: ${name}, value: ${value}`);
    }

    const response = await fetch(` /api/users/${userId}/documents`, {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      console.log('Documento agregado con éxito');
      productForm.reset();
      /*       window.location.reload(); */
    } else {
      const error = await response.json();
      console.error('Error al agregar el documento:', error);
    }
  });
});

document.addEventListener('DOMContentLoaded', function () {
  const roleSelectForm = document.getElementById('roleSelect');

  roleSelectForm.addEventListener('submit', function (event) {
    event.preventDefault();

    // Obtiene el valor seleccionado del formulario
    const selectedRole = document.querySelector('#roleSelect select').value;

    // Obtiene el UID del usuario desde el elemento con el atributo 'data-user-id'
    const userIdElement = document.getElementById('userId');
    const userId = userIdElement.getAttribute('data-user-id');

    // Realiza la solicitud PUT para cambiar el role
    fetch(`/api/users/premium/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ role: selectedRole }),
    })
      .then((response) => {
        if (response.status === 200) {
          // La solicitud PUT se completó con éxito

          // Realiza una solicitud de logout
          fetch('/api/session/auth/logout')
            .then(() => {
              swal('¡La solicitud de cambio de Role se ha completado con éxito!', 'Vuelve a loguearte con tu nuevo Role', 'success').then(function () {
                // Redirigir al usuario a la página de productos
                window.location.href = '/';
              });
            })
            .catch((logoutError) => {
              console.error('Error en la solicitud de logout:', logoutError);
              swal('Error', 'La solicitud de cambio de Role se realizó con éxito pero hubo un error en el logout ', 'error');
            });
        } else {
          swal('Error', 'Error al intentar cambiar de Role. No has terminado de procesar tu documentación requerida para cambiar de Role User a Premium', 'error');
        }
      })
      .catch((error) => {
        console.error('Error en la solicitud PUT:', error);
      });
  });
});
// Obtén el elemento select y el botón
const select = document.getElementById('roleSelect');
const submitButton = document.getElementById('submitButton');

// Agrega un evento de cambio al elemento select
select.addEventListener('change', function () {
  // Verifica si se ha realizado una selección
  if (select.value !== 'Role') {
    // Habilita el botón
    submitButton.removeAttribute('disabled');
  } else {
    // Deshabilita el botón
    submitButton.setAttribute('disabled', 'true');
  }
});
