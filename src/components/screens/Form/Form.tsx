import styles from "./Form.module.scss"
import {FormEvent, useContext, useEffect, useState} from "react";
import {TelegramContext} from "@/components/providers/TelegramProvider";
import {useCart} from "@/components/hooks/useCart";
import {useQuery} from "react-query";
import {saloonService} from "@/components/sevices/SaloonService";
import {Loader} from "@/components/ui/Loader/Loader";

enum MethodPayment {
    ONLINE = "online",
    ONGET = 'onGet',
    NONE= 'none'
}

const Form = () => {
    const {tg} = useContext(TelegramContext)
    const {cart} = useCart()
    const [currentPaymentType, setCurrentPaymentType] = useState<string>('Оплата картой')
    const [methodPayment, setMethodPayment] = useState<MethodPayment>(MethodPayment.NONE)
    const {data, isLoading} = useQuery("paymentData",
        () => saloonService.getPaymentData(tg?.initDataUnsafe?.user?.id as number, cart.map(order => {
            return {name : order.dish.name, count : order.count, price : order.dish.price}
        })))

    function validation() {
        const allInputs = document.querySelectorAll('input');
        let result = true


        for (const input of allInputs) {
            const telValid = input.id === 'inputTel' && (input.value.match(/^9/) ? input.value.match(/^\+?[9]\d{2}\d{3}\d{2}\d{2}$/) === null : input.value.match(/^\+?[78]\d{3}\d{3}\d{2}\d{2}$/) === null)
            if (input.value === '' || telValid) {
                result = false
                input.classList.add('error-validation')
                const parent = input.parentNode;
                if (!parent?.querySelector('.error-label')) {
                    const errorLabel = document.createElement('label')
                    errorLabel.classList.add('error-label')
                    errorLabel.textContent = telValid && input.value !== '' ? 'Неккоректный номер телефона' : 'Поле не заполнено!'
                    parent?.append(errorLabel)
                }
                if (parent?.querySelector('.tel-label')) {
                    parent?.querySelector('.tel-label')?.remove()
                }
            }
        }

        return result
    }

    function validateTel(evt : any) {
        let theEvent = evt;
        let key = theEvent.keyCode || theEvent.which;
        key = String.fromCharCode( key );
        let regex = /[0-9]|\+/;
        if( !regex.test(key) ) {
            theEvent.returnValue = false;
            if(theEvent.preventDefault) theEvent.preventDefault();
        }
    }

    function buy() {

        if (!validation()) return

        const name = document.querySelector('#inputName') as HTMLInputElement
        const tel = document.querySelector('#inputTel') as HTMLInputElement
        const address = document.querySelector('#inputAddress') as HTMLInputElement
        const com = document.querySelector('#inputCom') as HTMLInputElement
        const surrender = document.querySelector('#inputSurrender') as HTMLInputElement | undefined
        const paymentType = document.querySelector('input[type="radio"]:checked') as HTMLInputElement

        const delivery = {
            name : name.value as string,
            telephone : tel.value as string,
            address : address.value as string,
            paymentType : paymentType.value as string,
            surrender : surrender ? surrender.value : null,
            com : com.value as string
        }

    }

    function removeError(e : FormEvent<HTMLInputElement>) {
        if (e.currentTarget.classList.contains('error-validation')){
            e.currentTarget.classList.remove('error-validation')
            e.currentTarget.parentNode?.querySelector('.error-label')?.remove()
        }
    }

    useEffect(() => {
        tg?.MainButton.setParams({text: "Продолжить", color: "#FF7020"})
        tg?.MainButton.hide()
    }, [])

    useEffect(() => {

        if (methodPayment !== MethodPayment.NONE) tg?.MainButton.show()

        if (methodPayment === MethodPayment.ONLINE && data) tg?.openInvoice(data.url, (status : any) => {
            tg?.showAlert(status)
        })

    }, [methodPayment])

    if (isLoading) return <Loader/>

    if (!data) return <span>Данные отсутствуют по неизвестной причине :(</span>

    if (methodPayment === MethodPayment.NONE) return (
        <>
            <div className={"p-8 flex flex-col justify-center items-center h-full"}>
                <h2 className={"text-center text-2xl font-semibold mb-8"}>Как вы желаете оплатить?</h2>
                <div className={'flex gap-3 justify-center'}>
                    <button
                        className={"w-[140px] bg-[#FF5A30] text-white p-2 rounded-[5px] transform hover:scale-[1.05] transition-all duration-500"}
                        onClick={() => setMethodPayment(MethodPayment.ONGET)}>При получении
                    </button>
                    <button
                        className={"w-[140px] bg-[#FF5A30] text-white p-2 rounded-[5px] transform hover:scale-[1.05] transition-all duration-500"}
                        onClick={() => setMethodPayment(MethodPayment.ONLINE)}>Сразу
                    </button>
                </div>
            </div>
        </>
    )

    return (
        <div className={styles.form}>
            <h2 className={styles.title}>Доставка</h2>
            <div className={styles.wrapper}>
                <div className={styles.inputWrapper}><input className={styles.input} onInput={removeError} type="text" id='inputName' defaultValue={data.name}
                                                     placeholder='Имя'/></div>
                <div className={styles.inputWrapper}><input className={styles.input} onInput={removeError} type="tel" onKeyPress={validateTel} defaultValue={data.telephone}
                                                     id='inputTel' placeholder='Телефон'/></div>
                <div className={styles.inputWrapper}><input className={styles.input} onInput={removeError} type="text" defaultValue={data.address} id='inputAddress' placeholder='Адрес'/></div>
            </div>
            <div className={styles.radioWrapper}>
                <label className={styles.radioLabel}>
                    <input className={styles.radio} type="radio" name="format" defaultChecked={true} onClick={() => setCurrentPaymentType('Оплата картой')} value="Оплата картой"/>
                    <span className={styles.customRadio}></span>
                    <span>Оплата картой</span>
                </label>
                <label className={styles.radioLabel}>
                    <input className={styles.radio} type="radio" name="format" defaultChecked={false} onClick={() => setCurrentPaymentType('Наличные')} value="Наличные"/>
                    <span className={styles.customRadio}></span>
                    <span>Наличные</span>
                </label>
            </div>
            {currentPaymentType === 'Наличные' ? <div className={styles.inputWrapper}><input className={styles.input} onInput={removeError} id='inputSurrender' type="tel" onKeyPress={validateTel} placeholder='Сдача с ...'/></div> : null}
            <textarea placeholder='Комментарий к заказу...' id='inputCom' className={styles.textArea}></textarea>
        </div>
    );
};

export {Form};