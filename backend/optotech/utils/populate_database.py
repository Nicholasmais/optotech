import psycopg2
import random
import os
from dotenv import load_dotenv
from datetime import datetime, timedelta

dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(dotenv_path)

# Conexão com o banco de dados
conn = psycopg2.connect(
    dbname=os.environ.get("DB_NAME"), 
    user=os.environ.get("DB_USER"), 
    password=os.environ.get("DB_PASSWORD"), 
    host=os.environ.get("DB_HOST")
)
conn.autocommit = True

# Cria um cursor para executar operações no banco de dados
cur = conn.cursor()

# IDs de usuários fornecidos
id_usuarios = [
    "25811e6f-6ee8-4468-a3b1-1373612971c7",
    "d89a7e63-1e8a-4fa1-9c0a-3e42710688af",
    "a7bcc80d-676e-4f9b-b5c1-67d0e61abe57",
    "cf68d310-3592-4452-a8d9-99ba0b10743e"
]

nomes = ["Ana", "Beatriz", "Carlos", "Daniel", "Eduardo", "Fernanda", "Gabriela", "Hugo", "Igor", "Julia", "Larissa", "Mariana", "Natalia", "Otavio", "Paula", "Rafael", "Sofia", "Tiago", "Ursula", "Vitoria", "William", "Xavier", "Yasmin", "Zoe"]
acuidades = ['20/200', '20/100', '20/70', '20/50', '20/40', '20/30', '20/25', '20/20', '20/15', '20/13', '20/10']
max_atendimentos = 4
num_patients = 10

def random_date():
    start_date = datetime(2020, 1, 1)
    end_date = datetime.now()
    time_between_dates = end_date - start_date
    random_number_of_days = random.randrange(time_between_dates.days)
    random_date = start_date + timedelta(days=random_number_of_days)
    random_hour = random.randint(0, 23)
    random_minute = random.randint(0, 59)
    return random_date.replace(hour=random_hour, minute=random_minute)


for _ in range(num_patients):
    # Gerando dados aleatórios
    id_usuario_aleatorio = random.choice(id_usuarios)
    nome_paciente = random.choice(nomes)
    ano = random.randint(1950, 2010)
    mes = random.randint(1, 12)
    dia = random.randint(1, 28)  # Para simplificar, evita verificar o último dia de cada mês
    data_nascimento = f"{ano}-{mes:02d}-{dia:02d}"
    codigo = str(random.randint(1000, 9999))
    ativo = random.choice([True, False])  # Valor booleano aleatório

    # Comando SQL para inserir o novo aluno e retornar o ID gerado
    sql_paciente = """
        INSERT INTO alunos (nome, data_nascimento, codigo, ativo) 
        VALUES (%s, %s, %s, %s) RETURNING id;
    """

    cur.execute(sql_paciente, (nome_paciente, data_nascimento, codigo, ativo))
    id_paciente = cur.fetchone()[0]

    # Comando SQL para inserir o registro na tabela user_alunos
    sql_user_alunos = """
        INSERT INTO user_alunos (user_id, aluno_id) 
        VALUES (%s, %s);
    """
    cur.execute(sql_user_alunos, (id_usuario_aleatorio, id_paciente))

    num_atendimentos = random.randint(0, max_atendimentos)
    for _ in range(num_atendimentos):
        acuidade_1 = random.choice(acuidades)
        acuidade_2 = random.choice(acuidades)
        acuidade = f"{acuidade_1}.{acuidade_2}"
        data_atendimento = random_date()

        sql_appointments = """
            INSERT INTO appointments (aluno_id, user_id, acuidade, data_atendimento) 
            VALUES (%s, %s, %s, %s);
        """
        cur.execute(sql_appointments, (id_paciente, id_usuario_aleatorio, acuidade, data_atendimento))


# Fecha o cursor e a conexão
cur.close()
conn.close()
