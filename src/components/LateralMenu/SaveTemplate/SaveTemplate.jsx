import classNames from 'classnames/bind';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useStore } from '~/hooks';
import { useSelector } from '~/hooks/useSelector';
import { UserSelect } from '~/store/user';
import { updateUser } from '~/firebase/services';
import { setDraggableModals, setTemplate } from '~/store/session';
import Button from '~/components/Button';
import Notification from '~/components/Notification';
import TemplateItem from './TemplateItem';
import EffectItem from '../Mixer/EffectItem';
import { sets } from '~/assets/data/sets.data';
import { getEffectIcon } from '~/utils/icon-map/effects';
import { arrowLeftIcon, chillIcon, editIcon, jazzyIcon, saveIcon, sleepyIcon } from '~/assets/icons';
import { CircularLoading } from '~/components/Loading';
import { TEMPLATES } from '~/constants/texts';

import styles from './SaveTemplate.module.scss';
const cx = classNames.bind(styles);

function SaveTemplate() {
    const { session, currentUser, setMenuActive } = useStore();
    const [, sessionDispatch] = session;
    const navigate = useNavigate();

    const [templateToEdit, setTemplateToEdit] = useState();
    const [name, setName] = useState('');
    const [isEdit, setIsEdit] = useState(false);
    const [alert, setAlert] = useState({ message: '', severity: 'info' });
    const [isLoading, setIsLoading] = useState(false);

    const userData = useSelector(UserSelect.getUserData);
    const templates = userData.templates;
    const templateSet = sets.find((s) => s._id === templateToEdit?.setId);
    const templateScene = templateSet?.scenes[templateToEdit?.sceneIndex];

    const handelSetTemplate = (template) => {
        sessionDispatch(setTemplate({ template }));
    };

    const handleSave = () => sessionDispatch(setDraggableModals('templates'));

    const handleEditTemplate = (t) => setTemplateToEdit(t);

    const handleDeleteTemplate = async (template) => {
        let _templates = [...userData.templates];
        const templateIndex = _templates.findIndex((t) => t._id === template._id); //find index of new template
        _templates.splice(templateIndex, 1); //remove it from array templates
        const newData = { ...userData, templates: _templates };

        await updateUser(currentUser.uid, newData);
    };

    const handleEditName = async (e) => {
        e.preventDefault();
        if (name.length > 0) {
            try {
                setIsLoading(true);
                const newTemplate = { ...templateToEdit, name };
                let _templates = [...userData.templates];
                const templateIndex = _templates.findIndex((t) => t._id === newTemplate._id); //find index of new template
                _templates.splice(templateIndex, 1, newTemplate); //replace the old template
                const newData = { ...userData, templates: _templates };

                await updateUser(currentUser.uid, newData);
                setTemplateToEdit(newTemplate);
                setIsEdit(false);
                setAlert({ ...alert, message: `Template's name updated`, severity: 'success' });
            } catch (error) {
                setAlert({ ...alert, message: `Update failed`, severity: 'error' });
            }
            setIsLoading(false);
        }
    };
    return (
        <div className={cx('wrapper')}>
            {alert.message && (
                <Notification
                    open={!!alert.message}
                    severity={alert.severity}
                    message={alert.message}
                    onClose={() => setAlert({ ...alert, message: '' })}
                />
            )}
            {!currentUser && (
                <div className={cx('premium-banner')}>
                    <h4>
                        Please <span className={cx('accent')}>sign in</span> to use our playlists and to save templates
                    </h4>
                    <Button
                        type={'rounded'}
                        className={cx('login-btn')}
                        onClick={() => {
                            navigate('?auth=login');
                            setMenuActive(undefined);
                        }}
                    >
                        Sign in
                    </Button>
                </div>
            )}
            {!templateToEdit ? (
                // show when open template - lateral menu
                <>
                    <div className={cx('header')}>
                        <h5 className={cx('title')}>Playlists</h5>
                        <Button type="outline" className={cx('save-btn')} leftIcon={saveIcon} onClick={handleSave}>
                            Save Template
                        </Button>
                    </div>
                    <div className={cx('playlists-template')}>
                        <img
                            className={cx('p1')}
                            alt="chill template"
                            onClick={() => handelSetTemplate(TEMPLATES.chill)}
                        />
                        <img
                            className={cx('p2')}
                            alt="focus template"
                            onClick={() => handelSetTemplate(TEMPLATES.focus)}
                        />
                        <img
                            className={cx('p3')}
                            alt="sleep template"
                            onClick={() => handelSetTemplate(TEMPLATES.sleep)}
                        />
                    </div>
                    <div className={'py-6'}>
                        <h4 className={cx('title')}>Templates</h4>
                        <div className={cx('templates-list')}>
                            {currentUser && templates?.length > 0 ? (
                                templates.map((template, index) => {
                                    return (
                                        <TemplateItem
                                            key={`t_${index}`}
                                            template={template}
                                            onEdit={() => handleEditTemplate(template)}
                                            onDelete={() => handleDeleteTemplate(template)}
                                            onPlay={() => handelSetTemplate(template)}
                                        />
                                    );
                                })
                            ) : (
                                <p className="opacity-50">You don't have any template saved</p>
                            )}
                        </div>
                    </div>
                </>
            ) : (
                // template's details when click edit
                <>
                    <div className={cx('header')}>
                        <img
                            src={arrowLeftIcon}
                            alt="back"
                            className={cx('back-btn')}
                            onClick={() => setTemplateToEdit(undefined)}
                        />
                        <h4 className={cx('title')} style={{ flex: 1, textAlign: 'center' }}>
                            View Template
                        </h4>
                    </div>
                    <div className={cx('editor')}>
                        <img src={templateScene.thumbnail} className={cx('template-preview')} alt="template preview" />
                        <div className={cx('name-editor')}>
                            <p className={cx('template-name')}>{templateToEdit.name}</p>
                            <img
                                src={editIcon}
                                alt="edit icon"
                                className={cx('edit-btn')}
                                onClick={() => setIsEdit(!isEdit)}
                            />
                        </div>
                    </div>
                    {isEdit && (
                        <div className={cx('form-container')}>
                            {isLoading && <CircularLoading isLoading={isLoading} className={cx('loading')} />}
                            <form action="" id="name-form" onSubmit={handleEditName}>
                                <p>Change name (enter to save)</p>
                                <input
                                    type="text"
                                    defaultValue={templateToEdit.name ?? ''}
                                    className={'general-input'}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </form>
                        </div>
                    )}
                    <div className={cx('effects-container')}>
                        {templateToEdit.effects.map((effect, index) => {
                            return (
                                <EffectItem
                                    icon={getEffectIcon(effect.type, true)}
                                    label={effect.name}
                                    level={effect.level}
                                    changeScene={() => { }}
                                    changeVol={() => { }}
                                    key={index}
                                    disabled
                                />
                            );
                        })}
                    </div>
                    <h5 className={cx('sub-title')}>Mood</h5>
                    <div className={cx('moods')}>
                        <div className={cx('mood-item', `${templateToEdit.mood === 'sleepy' && 'selected'}`)}>
                            <img src={sleepyIcon} alt="sleepy" className={cx('mood-icon')} />
                            <p>Sleepy</p>
                        </div>
                        <div className={cx('mood-item', `${templateToEdit.mood === 'jazzy' && 'selected'}`)}>
                            <img src={jazzyIcon} alt="jazzy" className={cx('mood-icon')} />
                            <p>Jazzy</p>
                        </div>
                        <div className={cx('mood-item', `${templateToEdit.mood === 'chill' && 'selected'}`)}>
                            <img src={chillIcon} alt="chill" className={cx('mood-icon')} />
                            <p>Chill</p>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default SaveTemplate;
