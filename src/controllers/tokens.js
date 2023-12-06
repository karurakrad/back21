// CREAR UN USUARIO JWT
app.post('/crear', async (req, res) => {
	const { username, email, password } = req.body // OBTENER USUARIO, EMAIL Y PASSWORD DE LA PETICIÓN

	try {
		// GENERAMOS STRING ALEATORIO PARA USARSE CON EL PASSWORD
		const salt = await bcryptjs.genSalt(10)
		const hashedPassword = await bcryptjs.hash(password, salt)

		// CREAMOS UN USUARIO CON SU PASSWORD ENCRIPTADO
		const respuestaDB = await Usuario.create({
			username,
			email,
			password: hashedPassword,
		})
		// USUARIO CREADO. VAMOS A CREAR EL JSON WEB TOKEN

		const payload = {
			user: {
				id: respuestaDB._id,
			},
		}

		// 2. FIRMAR EL JWT
		jwt.sign(
			payload, // DATOS QUE SE ACOMPAÑARÁN EN EL TOKEN
			process.env.SECRET, // LLAVE PARA DESCIFRAR LA FIRMA ELECTRÓNICA DEL TOKEN,
			{
				expiresIn: 360000, // EXPIRACIÓN DEL TOKEN
			},
			(error, token) => {
				// CALLBACK QUE, EN CASO DE QUE EXISTA UN ERROR, DEVUELVA EL TOKEN
				if (error) throw error
				// res.json(respuestaDB)
				res.json({ token })
			}
		)
	} catch (error) {
		return res.status(400).json({
			msg: error,
		})
	}
})

app.get('/verificar', auth, async (req, res) => {
	try {
		// CONFIRMAMOS QUE EL USUARIO EXISTA EN BASE DE DATOS Y RETORNAMOS SUS DATOS, EXCLUYENDO EL PASSWORD
		const usuario = await Usuario.findById(req.user.id).select('-password')
		res.json({ usuario })
	} catch (error) {
		// EN CASO DE ERROR DEVOLVEMOS UN MENSAJE CON EL ERROR
		res.status(500).json({
			msg: 'Hubo un error',
			error,
		})
	}
})