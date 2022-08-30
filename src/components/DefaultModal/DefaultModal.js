import classNames from 'classnames/bind';
import { Transition, Dialog } from '@headlessui/react';
import React, { Fragment, useContext } from 'react';
import { AppContext } from '~/Context/AppProvider';

import styles from './DefaultModal.module.scss';
import Tutorial from '~/components/Tutorial';
import AboutUs from '~/components/AboutUs';
import Share from '~/components/Share';
const cx = classNames.bind(styles);

function DefaultModal() {
    const { modalType, setModalType } = useContext(AppContext);

    const closeModal = () => setModalType(null);

    return (
        <div className={cx('wrapper')}>
            <Transition show={!!modalType} as={Fragment}>
                <Dialog as="div" className={cx('dialog')} onClose={closeModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="linear duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        {/* backdrop blur */}
                        <div
                            className={`fixed inset-0 
                           ${
                               ['Tutorial', 'AboutUs'].includes(modalType)
                                   ? 'bg-black/70 backdrop-blur-xl'
                                   : 'bg-black/50'
                           }
                       `}
                            aria-hidden="true"
                        />
                    </Transition.Child>

                    <Transition.Child
                        as={Fragment}
                        enter="linear duration-500"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className={cx('Modal')}>
                            {modalType === 'Tutorial' && <Tutorial />}
                            {modalType === 'AboutUs' && <AboutUs />}
                            {modalType === 'Share' && <Share />}
                        </div>
                    </Transition.Child>
                </Dialog>
            </Transition>
        </div>
    );
}

export default DefaultModal;
