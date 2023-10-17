import { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, FormControl, InputLabel, MenuItem, Select, Switch, TextField, Typography } from '@mui/material';
import { body, button, buttonMobile, buttonMobileSuccess, buttonSuccess, container, containerLoadingBtn, containerLoadingBtnMobile, containerSelect, form, input, inputError, inputGroup1, inputGroup2, inputGroupMobile, title } from './styles/AppStyles';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import * as Yup from 'yup';
import axios from 'axios';
import { toast } from 'react-toastify';
import { calculateAge } from './utils/calculateAge';
import { useParams } from 'react-router-dom';

const schema = Yup.object().shape({
  nome: Yup.string().required('O nome é obrigatório'),
  dataNascimento: Yup.date().required('A data de nascimento é obrigatória').typeError('A data de nascimento é obrigatória'),
  idade: Yup.number().required('A idade é obrigatória').typeError('A idade é obrigatória'),
  telefone: Yup.string().required('O telefone é obrigatório'),
  email: Yup.string().email('Digite um email válido').required('O email é obrigatório'),
  profissao: Yup.string().required('Profissão é obrigatório'),
  escolaridade: Yup.string().required('Escolaridade é obrigatório'),
  redesSociais: Yup.string().required('Rede social é obrigatório'),
  cep: Yup.string().required('Cep é obrigatório'),
  rua: Yup.string().required('Rua é obrigatório'),
  bairro: Yup.string().required('Bairro é obrigatório'),
  numeroCasa: Yup.string().required('Número é obrigatório'),
  rg: Yup.string().required('RG é obrigatório'),
  orgaoExpedidor: Yup.string().required('Orgão expeditor é obrigatório'),
  cpf: Yup.string().required('CPF é obrigatório'),
  tituloEleitor: Yup.string().required('Título de eleitor é obrigatório'),
  zona: Yup.string().required('Zona eleitoral é obrigatório'),
  secao: Yup.string().required('Sessão é obrigatório'),
  faixaSalarial: Yup.number().required('Salário mínimo é obrigatório').typeError('Salário mínimo é obrigatório'),
  recebeBeneficio: Yup.boolean(),
});


function App() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const [cepFind, setCepFind] = useState(false)
  const [cepLoading, setCeploading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [ageSetted, setAgeSetted] = useState(false)
  const [apiSuccess, setApiSuccess] = useState(false)

  window.addEventListener("resize", () => setWindowWidth(window.innerWidth))

  let { id } = useParams();

  const { register, handleSubmit, reset, setValue, formState: { errors }, watch } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: any) => {
    const key = window.location.href.includes("adm") ? { admId: id } : { liderId: id }
    setLoading(true)
    axios.post(`${process.env.REACT_APP_PORT_PROJECT_BACKEND}/api/colaborador`, {
      ...data,
    }).then((res) => {
      setLoading(false)
      setApiSuccess(true)
      reset()
      toast.success(res.data.message)
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        })
        setApiSuccess(false)
      }, 3000)
    }).catch((err) => {
      setLoading(false)
      toast.error(err.response.data.message)
    })
  };

  const cepListenner = watch("cep")
  const dataNascimentoListenner = watch("dataNascimento")

  useEffect(() => {

    const age = calculateAge(dataNascimentoListenner?.toString())
    if (age) {
      setAgeSetted(true)
      setValue("idade", age)
    }

  }, [dataNascimentoListenner])

  useEffect(() => {
    if (cepListenner?.length == 8) {
      setCeploading(true)
      axios.get(`https://brasilapi.com.br/api/cep/v2/${cepListenner}`, {
      }).then((res) => {
        setValue("rua", res.data.street)
        setValue("bairro", res.data.neighborhood)
        setCepFind(true)
        setCeploading(false)
      }).catch((err) => {
        err.response.data.errors.map((erro: any) => {
          if (erro.message == "CEP NAO ENCONTRADO") {
            toast.error("Cep não encontrado")
            setValue("rua", "")
            setValue("bairro", "")
            setCepFind(false)
            setCeploading(false)
          }
        })
      })
    }
  }, [cepListenner])


  return (
    <Box sx={body}>

      <Box sx={container}>
        <Typography variant="h2" component="h2" sx={title}>
          Cadastre-se
        </Typography>
        <Box sx={form} component="form" onSubmit={handleSubmit(onSubmit)}>
          <Typography variant='h4' component="h4" sx={{ fontSize: "20px", color: "#202B71", fontWeight: 700 }}>
            Dados Pessoais
          </Typography>
          <Box sx={windowWidth < 550 ? inputGroupMobile : inputGroup1}>
            <TextField
              label={errors.nome?.message ?? "Nome Completo"}
              {...register("nome")}
              error={!!errors.nome?.message}
              variant="filled"
              {...register}
              sx={windowWidth < 550 ? errors.nome?.message ? inputError : input : errors.nome?.message ? inputError : { ...input, gridColumn: "1/3" }}
            />
            <TextField
              label={errors.dataNascimento?.message ?? "Data de nascimento"}
              {...register("dataNascimento")}
              error={!!errors.dataNascimento?.message}
              variant="filled"
              InputLabelProps={{
                shrink: true,
              }}
              sx={errors.dataNascimento?.message ? inputError : input}
              type='date'
            />
            <TextField
              label={errors.idade?.message ?? "Idade"}
              {...register("idade")}
              error={!!errors.idade?.message}
              variant="filled"
              type='number'
              InputLabelProps={ageSetted ? { shrink: true } : { shrink: false }}
              sx={errors.idade?.message ? inputError : input}
            />
            <TextField
              label={errors.telefone?.message ?? "Telefone"}
              {...register("telefone")}
              error={!!errors.telefone?.message}
              variant="filled"
              sx={errors.telefone?.message ? inputError : input}
            />
            <TextField
              label={errors.email?.message ?? "Email"}
              {...register("email")}
              error={!!errors.email?.message}
              variant="filled"
              sx={errors.email?.message ? inputError : input}
            />
            <TextField
              label={errors.profissao?.message ?? "Profissão"}
              {...register("profissao")}
              error={!!errors.profissao?.message}
              variant="filled"
              sx={errors.profissao?.message ? inputError : input}
            />
            <TextField
              label={errors.escolaridade?.message ?? "Escolaridade"}
              {...register("escolaridade")}
              error={!!errors.escolaridade?.message}
              variant="filled"
              sx={errors.escolaridade?.message ? inputError : input}
            />
            <TextField
              label={errors.redesSociais?.message ?? "Rede Social"}
              {...register("redesSociais")}
              error={!!errors.redesSociais?.message}
              variant="filled"
              sx={errors.redesSociais?.message ? inputError : input}
            />
          </Box>
          <Typography variant='h4' component="h4" sx={{ fontSize: "20px", color: "#202B71", fontWeight: 700, marginTop: 3 }}>
            Endereço
          </Typography>
          <Box sx={windowWidth < 550 ? inputGroupMobile : inputGroup2}>
            <TextField
              label={errors.cep?.message ?? "Cep"}
              {...register("cep")}
              error={!!errors.cep?.message}
              variant="filled"
              sx={windowWidth < 550 ? errors.cep?.message ? inputError : input : errors.cep?.message ? inputError : input}
            />
            {cepLoading ?
              <Box sx={{ width: "231px", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#e4e4e4", borderBottom: "4px solid #202B71" }}>
                <CircularProgress size={25} />
              </Box>
              :
              <TextField
                label={errors.rua?.message ?? "Rua"}
                {...register("rua")}
                error={!!errors.rua?.message}
                variant="filled"
                InputLabelProps={cepFind ? { shrink: true } : { shrink: false }}
                sx={errors.rua?.message ? inputError : input}
              />
            }
            {cepLoading ?
              <Box sx={{ width: "231px", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#e4e4e4", borderBottom: "4px solid #202B71" }}>
                <CircularProgress size={25} />
              </Box>
              :
              <TextField
                label={errors.bairro?.message ?? "Bairro"}
                {...register("bairro")}
                error={!!errors.bairro?.message}
                variant="filled"
                InputLabelProps={cepFind ? { shrink: true } : { shrink: false }}
                sx={errors.bairro?.message ? inputError : input}
              />
            }
            <TextField
              label={errors.numeroCasa?.message ?? "Número"}
              {...register("numeroCasa")}
              error={!!errors.numeroCasa?.message}
              variant="filled"
              sx={errors.numeroCasa?.message ? inputError : input}
            />
          </Box>
          <Typography variant='h4' component="h4" sx={{ fontSize: "20px", color: "#202B71", fontWeight: 700, marginTop: 3 }}>
            Documentos
          </Typography>
          <Box sx={windowWidth < 550 ? inputGroupMobile : inputGroup1}>
            <TextField
              label={errors.rg?.message ?? "RG"}
              {...register("rg")}
              error={!!errors.rg?.message}
              variant="filled"
              sx={windowWidth < 550 ? errors.rg?.message ? inputError : input : errors.rg?.message ? inputError : input}
            />
            <TextField
              label={errors.orgaoExpedidor?.message ?? "Orgão Expeditor"}
              {...register("orgaoExpedidor")}
              error={!!errors.orgaoExpedidor?.message}
              variant="filled"
              sx={errors.orgaoExpedidor?.message ? inputError : input}
            />
            <TextField
              label={errors.cpf?.message ?? "CPF"}
              {...register("cpf")}
              error={!!errors.cpf?.message}
              variant="filled"
              sx={errors.cpf?.message ? inputError : input}
            />
            <TextField
              label={errors.tituloEleitor?.message ?? "Título de eleitor"}
              {...register("tituloEleitor")}
              error={!!errors.tituloEleitor?.message}
              variant="filled"
              sx={errors.tituloEleitor?.message ? inputError : input}
            />
            <TextField
              label={errors.zona?.message ?? "Zona eleitoral"}
              {...register("zona")}
              error={!!errors.zona?.message}
              variant="filled"
              sx={errors.zona?.message ? inputError : input}
            />
            <TextField
              label={errors.secao?.message ?? "Sessão eleitoral"}
              {...register("secao")}
              error={!!errors.secao?.message}
              variant="filled"
              sx={errors.secao?.message ? inputError : input}
            />
          </Box>
          <Typography variant='h4' component="h4" sx={{ fontSize: "20px", color: "#202B71", fontWeight: 700, marginTop: 3 }}>
            Benefícios
          </Typography>
          <Box sx={windowWidth < 550 ? inputGroupMobile : inputGroup1}>
            <FormControl variant='filled'>
              <InputLabel sx={errors.faixaSalarial?.message ? { color: "#d32f2f" } : { color: "#202B71" }}>{errors.faixaSalarial?.message ?? "Salário mínimo"}</InputLabel>
              <Select
                label={errors.faixaSalarial?.message ?? "Salário mínimo"}
                {...register("faixaSalarial")}
                error={!!errors.faixaSalarial?.message}
                sx={errors.faixaSalarial?.message ? inputError : { ...input, padding: 0 }}
                defaultValue={""}
              >
                <MenuItem value={"0"}>Menos de 1 salário mínimo</MenuItem>
                <MenuItem value={"1"}>1 Salário mínimo</MenuItem>
                <MenuItem value={"2"}>2 Salários mínimo</MenuItem>
                <MenuItem value={"3"}>3 Salários mínimo</MenuItem>
                <MenuItem value={"4"}>4 Salários mínimo</MenuItem>
                <MenuItem value={"5"}>5 Salários mínimo</MenuItem>
                <MenuItem value={"6"}>6 Salários mínimo</MenuItem>
                <MenuItem value={"7"}>Mais de 6 salários mínimo</MenuItem>
              </Select>
            </FormControl>
            <Box sx={containerSelect}>
              <Typography>Recebe algum benefício?</Typography>
              <Typography sx={{ marginLeft: "20px", fontWeight: 700 }}>Não</Typography>
              <Switch
                {...register("recebeBeneficio")}
              />
              <Typography sx={{ fontWeight: 700 }}>Sim</Typography>
            </Box>
          </Box>
          {loading ?
            <Box sx={{ display: "flex", marginTop: 5, justifyContent: "end" }}>
              <Box sx={windowWidth < 550 ? containerLoadingBtnMobile : containerLoadingBtn}>
                <CircularProgress color='inherit' size={25} />
              </Box>
            </Box>
            :
            !apiSuccess && <Box sx={{ display: "flex", marginTop: 5, justifyContent: "end" }}>
              <Button variant='contained' type='submit' sx={windowWidth < 550 ? buttonMobile : button} >Cadastrar</Button>
            </Box>
          }
          {apiSuccess &&
            <Box sx={{ display: "flex", marginTop: 5, justifyContent: "end" }}>
              <Button variant='contained' type='submit' color='success' sx={windowWidth < 550 ? buttonMobileSuccess : buttonSuccess} >Cadastrado !</Button>
            </Box>
          }

        </Box>
      </Box>

    </Box>
  );
}

export default App;
